'use client'

import React, { useState } from 'react'
import { Shield, AlertTriangle, CheckCircle, DollarSign, Users, Activity } from 'lucide-react'

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
  analysisTime: string
  transactionId: string
}

export default function Home() {
  const [transaction, setTransaction] = useState<TransactionData>({
    type: 'PAYMENT',
    amount: 0,
    oldbalanceOrg: 0,
    newbalanceOrig: 0,
    oldbalanceDest: 0,
    newbalanceDest: 0
  })

  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const transactionTypes = ['PAYMENT', 'TRANSFER', 'CASH_OUT', 'CASH_IN', 'DEBIT']

  const handleInputChange = (field: keyof TransactionData, value: string | number) => {
    setTransaction(prev => ({
      ...prev,
      [field]: field === 'type' ? value : typeof value === 'string' ? parseFloat(value) || 0 : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setPrediction(null)

    try {
      // Use FastAPI backend instead of Next.js API route
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: transaction.type,
          amount: transaction.amount,
          oldbalanceOrg: transaction.oldbalanceOrg,
          newbalanceOrig: transaction.newbalanceOrig,
          oldbalanceDest: transaction.oldbalanceDest,
          newbalanceDest: transaction.newbalanceDest
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to analyze transaction')
      }

      const result = await response.json()
      setPrediction(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze transaction. Please try again.'
      setError(errorMessage)
      console.error('Analysis error:', err)
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black shadow-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-white">Fraud Detection System</h1>
            </div>
            <div className="flex items-center space-x-4 text-sm text-blue-400">
              <Activity className="h-4 w-4" />
              <span>AI-Powered Analysis</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Transaction Form */}
          <div className="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-blue-500" />
              Transaction Analysis
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Transaction Type */}
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Transaction Type
                </label>
                <select
                  value={transaction.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 bg-blue-900 text-white font-semibold cursor-pointer shadow-sm"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  {transactionTypes.map(type => (
                    <option key={type} value={type} className="bg-blue-900 text-white font-semibold">{type}</option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Amount ($)
                </label>
                <input
                  type="number"
                  value={transaction.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-white"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>

              {/* Origin Account Balances */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Origin Old Balance ($)
                  </label>
                  <input
                    type="number"
                    value={transaction.oldbalanceOrg}
                    onChange={(e) => handleInputChange('oldbalanceOrg', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-white"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Origin New Balance ($)
                  </label>
                  <input
                    type="number"
                    value={transaction.newbalanceOrig}
                    onChange={(e) => handleInputChange('newbalanceOrig', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-white"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              {/* Destination Account Balances */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Destination Old Balance ($)
                  </label>
                  <input
                    type="number"
                    value={transaction.oldbalanceDest}
                    onChange={(e) => handleInputChange('oldbalanceDest', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-white"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Destination New Balance ($)
                  </label>
                  <input
                    type="number"
                    value={transaction.newbalanceDest}
                    onChange={(e) => handleInputChange('newbalanceDest', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-white"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Analyzing...' : 'Analyze Transaction'}
              </button>
            </form>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {/* Prediction Result */}
            {prediction && (
              <div className="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4">Analysis Result</h3>

                <div className="p-4 rounded-lg border bg-black">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {prediction.isFraud ? (
                        <AlertTriangle className="h-6 w-6 text-white" />
                      ) : (
                        <CheckCircle className="h-6 w-6 text-white" />
                      )}
                      <div>
                        <p className="font-semibold text-white">
                          {prediction.isFraud ? 'Suspicious Transaction Detected' : 'Transaction Appears Legitimate'}
                        </p>
                        <p className="text-sm text-gray-200">
                          Confidence: {prediction.confidence}%
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-black border border-white text-white">
                      {prediction.riskLevel.toUpperCase()} RISK
                    </span>
                  </div>
                </div>
                {/* Risk Factors */}
                {prediction.riskFactors && prediction.riskFactors.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-blue-200 font-semibold mb-2">Risk Factors:</h4>
                    <ul className="list-disc list-inside text-blue-100">
                      {prediction.riskFactors.map((factor, idx) => (
                        <li key={idx}>{factor}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            {/* Error Message */}
            {error && (
              <div className="bg-gray-900 rounded-lg p-4 border border-red-700 text-red-300">
                {error}
              </div>
            )}

            {/* Statistics */}
            <div className="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-4">System Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-900 rounded-lg">
                  <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-400">6.3M+</p>
                  <p className="text-sm text-blue-200">Transactions Analyzed</p>
                </div>
                <div className="text-center p-4 bg-green-900 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-400">99.9%</p>
                  <p className="text-sm text-green-200">Accuracy Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 