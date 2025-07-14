import { NextRequest, NextResponse } from 'next/server'

interface TransactionData {
  type: string
  amount: number
  oldbalanceOrg: number
  newbalanceOrig: number
  oldbalanceDest: number
  newbalanceDest: number
}

interface PredictionResult {
  isFraud: boolean
  confidence: number
  riskLevel: 'low' | 'medium' | 'high'
  riskFactors: string[]
}

// Simple fraud detection logic based on your analysis
function analyzeTransaction(data: TransactionData): PredictionResult {
  const riskFactors: string[] = []
  let riskScore = 0

  // Check for suspicious amount
  if (data.amount > 100000) {
    riskFactors.push('Large transaction amount')
    riskScore += 0.4
  } else if (data.amount > 50000) {
    riskFactors.push('High transaction amount')
    riskScore += 0.2
  }

  // Check for suspicious transaction types
  if (data.type === 'TRANSFER' || data.type === 'CASH_OUT') {
    riskFactors.push('Suspicious transaction type')
    riskScore += 0.3
  }

  // Check for zero balance after transaction
  if (data.oldbalanceOrg > 0 && data.newbalanceOrig === 0) {
    riskFactors.push('Account balance reduced to zero')
    riskScore += 0.3
  }

  // Check for large transfers
  if (data.amount > 50000 && data.type === 'TRANSFER') {
    riskFactors.push('Large transfer amount')
    riskScore += 0.2
  }

  // Check for unusual balance patterns
  if (data.oldbalanceOrg === 0 && data.amount > 10000) {
    riskFactors.push('Large transaction from empty account')
    riskScore += 0.4
  }

  // Determine risk level and confidence
  let riskLevel: 'low' | 'medium' | 'high'
  let confidence: number

  if (riskScore >= 0.7) {
    riskLevel = 'high'
    confidence = Math.min(0.95, 0.7 + riskScore * 0.2)
  } else if (riskScore >= 0.4) {
    riskLevel = 'medium'
    confidence = Math.min(0.85, 0.6 + riskScore * 0.3)
  } else {
    riskLevel = 'low'
    confidence = Math.max(0.6, 0.8 - riskScore * 0.2)
  }

  const isFraud = riskScore >= 0.5

  return {
    isFraud,
    confidence: Math.round(confidence * 100),
    riskLevel,
    riskFactors
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const transactionData: TransactionData = body

    // Validate input
    if (!transactionData.type || typeof transactionData.amount !== 'number') {
      return NextResponse.json(
        { error: 'Invalid transaction data' },
        { status: 400 }
      )
    }

    // Analyze the transaction
    const result = analyzeTransaction(transactionData)

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json(result)
  } catch (error) {
    console.error('Prediction error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze transaction' },
      { status: 500 }
    )
  }
} 