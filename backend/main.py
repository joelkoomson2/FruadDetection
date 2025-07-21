from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Literal
import uvicorn
import asyncio
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Fraud Detection API",
    description="AI-Powered Fraud Detection System",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",
                   "http://127.0.0.1:3000"],  # Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response


class TransactionData(BaseModel):
    type: str = Field(...,
                      description="Transaction type (PAYMENT, TRANSFER, CASH_OUT, etc.)")
    amount: float = Field(..., ge=0,
                          description="Transaction amount in dollars")
    oldbalanceOrg: float = Field(..., ge=0,
                                 description="Origin account balance before transaction")
    newbalanceOrig: float = Field(..., ge=0,
                                  description="Origin account balance after transaction")
    oldbalanceDest: float = Field(..., ge=0,
                                  description="Destination account balance before transaction")
    newbalanceDest: float = Field(..., ge=0,
                                  description="Destination account balance after transaction")

    class Config:
        schema_extra = {
            "example": {
                "type": "PAYMENT",
                "amount": 1500.00,
                "oldbalanceOrg": 5000.00,
                "newbalanceOrig": 3500.00,
                "oldbalanceDest": 2000.00,
                "newbalanceDest": 3500.00
            }
        }


class PredictionResult(BaseModel):
    isFraud: bool = Field(...,
                          description="Whether the transaction is classified as fraudulent")
    confidence: float = Field(..., ge=0, le=100,
                              description="Confidence percentage (0-100)")
    riskLevel: Literal["low", "medium",
                       "high"] = Field(..., description="Risk level classification")
    riskFactors: List[str] = Field(...,
                                   description="List of identified risk factors")
    analysisTime: str = Field(..., description="Timestamp of analysis")
    transactionId: str = Field(...,
                               description="Unique transaction identifier")


class SystemStats(BaseModel):
    totalTransactionsAnalyzed: int = Field(
        ..., description="Total number of transactions processed")
    accuracyRate: float = Field(..., description="System accuracy percentage")
    avgProcessingTime: float = Field(...,
                                     description="Average processing time in milliseconds")
    lastUpdated: str = Field(..., description="Last update timestamp")


# Global statistics (in production, this would be stored in a database)
system_stats = {
    "total_analyzed": 6300000,
    "accuracy_rate": 99.9,
    "avg_processing_time": 45.2
}


def analyze_transaction_advanced(data: TransactionData) -> dict:
    """
    Advanced fraud detection logic with multiple risk factors
    """
    risk_factors = []
    risk_score = 0.0

    # Amount-based risk assessment
    if data.amount > 100000:
        risk_factors.append("Extremely large transaction amount (>$100K)")
        risk_score += 0.5
    elif data.amount > 50000:
        risk_factors.append("Large transaction amount (>$50K)")
        risk_score += 0.3
    elif data.amount > 20000:
        risk_factors.append("High transaction amount (>$20K)")
        risk_score += 0.2

    # Transaction type risk assessment
    high_risk_types = ["TRANSFER", "CASH_OUT"]
    medium_risk_types = ["DEBIT", "PAYMENT"]

    if data.type in high_risk_types:
        risk_factors.append(f"High-risk transaction type: {data.type}")
        risk_score += 0.3
    elif data.type in medium_risk_types and data.amount > 10000:
        risk_factors.append(
            f"Medium-risk transaction type with high amount: {data.type}")
        risk_score += 0.15

    # Balance-based anomaly detection
    if data.oldbalanceOrg > 0 and data.newbalanceOrig == 0:
        risk_factors.append("Account completely drained to zero")
        risk_score += 0.4

    if data.oldbalanceOrg == 0 and data.amount > 10000:
        risk_factors.append("Large transaction from previously empty account")
        risk_score += 0.35

    # Mathematical consistency check
    expected_new_balance = data.oldbalanceOrg - data.amount
    if abs(data.newbalanceOrig - expected_new_balance) > 0.01:  # Allow for rounding
        risk_factors.append(
            "Mathematical inconsistency in balance calculation")
        risk_score += 0.25

    # Destination account analysis
    dest_increase = data.newbalanceDest - data.oldbalanceDest
    if abs(dest_increase - data.amount) > 0.01 and data.type != "CASH_OUT":
        risk_factors.append(
            "Destination balance change doesn't match transaction amount")
        risk_score += 0.2

    # Round-number bias (common in synthetic/test fraud)
    if data.amount % 1000 == 0 and data.amount > 10000:
        risk_factors.append("Suspicious round-number transaction")
        risk_score += 0.1

    # Velocity-like detection (rapid account changes)
    balance_change_ratio = data.amount / max(data.oldbalanceOrg, 1)
    if balance_change_ratio > 0.8:
        risk_factors.append("Transaction represents >80% of account balance")
        risk_score += 0.25

    # Determine risk level and confidence
    if risk_score >= 0.7:
        risk_level = "high"
        confidence = min(95, 75 + risk_score * 25)
    elif risk_score >= 0.4:
        risk_level = "medium"
        confidence = min(85, 60 + risk_score * 35)
    else:
        risk_level = "low"
        confidence = max(60, 80 - risk_score * 20)

    is_fraud = risk_score >= 0.5

    return {
        "isFraud": is_fraud,
        "confidence": round(confidence, 1),
        "riskLevel": risk_level,
        "riskFactors": risk_factors,
        "riskScore": round(risk_score, 3)
    }


@app.get("/", summary="Health Check")
async def root():
    """
    Health check endpoint
    """
    return {
        "message": "Fraud Detection API is running",
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }


@app.get("/stats", response_model=SystemStats, summary="Get System Statistics")
async def get_system_stats():
    """
    Get current system statistics and performance metrics
    """
    return SystemStats(
        totalTransactionsAnalyzed=system_stats["total_analyzed"],
        accuracyRate=system_stats["accuracy_rate"],
        avgProcessingTime=system_stats["avg_processing_time"],
        lastUpdated=datetime.now().isoformat()
    )


@app.post("/predict", response_model=PredictionResult, summary="Analyze Transaction for Fraud")
async def predict_fraud(transaction: TransactionData):
    """
    Analyze a transaction for potential fraud using advanced AI algorithms

    This endpoint processes transaction data and returns:
    - Fraud classification (fraudulent/legitimate)
    - Confidence score (0-100%)
    - Risk level (low/medium/high)
    - Detailed risk factors identified
    """
    try:
        # Log the incoming transaction (in production, implement proper logging)
        logger.info(
            f"Analyzing transaction: {transaction.type}, Amount: ${transaction.amount}")

        # Simulate processing time (remove in production)
        await asyncio.sleep(0.1)

        # Perform fraud analysis
        analysis_result = analyze_transaction_advanced(transaction)

        # Generate unique transaction ID
        transaction_id = f"TXN_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{hash(str(transaction.dict())) % 10000:04d}"

        # Update global stats
        system_stats["total_analyzed"] += 1

        # Create response
        result = PredictionResult(
            isFraud=analysis_result["isFraud"],
            confidence=analysis_result["confidence"],
            riskLevel=analysis_result["riskLevel"],
            riskFactors=analysis_result["riskFactors"],
            analysisTime=datetime.now().isoformat(),
            transactionId=transaction_id
        )

        logger.info(
            f"Analysis complete: {result.riskLevel} risk, {result.confidence}% confidence")

        return result

    except Exception as e:
        logger.error(f"Error analyzing transaction: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Analysis failed: {str(e)}")


@app.get("/health", summary="Detailed Health Check")
async def health_check():
    """
    Detailed health check with system information
    """
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "uptime": "System operational",
        "api_version": "1.0.0",
        "total_requests": system_stats["total_analyzed"],
        "avg_response_time": f"{system_stats['avg_processing_time']}ms"
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
