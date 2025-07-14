import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns

print("Loading data...")
df = pd.read_csv("AIML Dataset.csv")

print("Dropping 'step' column...")
df.drop(columns="step", inplace=True)

print("Creating df_model...")
df_model = df.drop(["nameOrig", "nameDest", "isFlaggedFraud"], axis=1)

print("Defining categorical and numeric columns...")
categorical = ["type"]
numeric = ["amount", "oldbalanceOrg", "newbalanceOrig", "oldbalanceDest", "newbalanceDest"]

print("Preparing X and y...")
y = df["isFraud"]
X = df_model.drop("isFraud", axis=1)

print("Creating preprocessor...")
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numeric),
        ('cat', OneHotEncoder(drop='first', sparse_output=False), categorical)
    ],
    remainder='drop'
)

print("Creating pipeline...")
pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('classifier', LogisticRegression(random_state=42, max_iter=1000))
])

print("Splitting data...")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, stratify=y, random_state=42)

print("Fitting pipeline...")
pipeline.fit(X_train, y_train)

print("Making predictions...")
y_pred = pipeline.predict(X_test)

print("Classification Report:")
print(classification_report(y_test, y_pred))

print("Pipeline test completed successfully!") 