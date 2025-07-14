# =============================================================================
# FIXED PIPELINE CODE FOR YOUR NOTEBOOK
# =============================================================================

# Cell 47: Fix data preparation and ensure 'step' column is dropped
# Make sure to drop the 'step' column if it still exists in df_model
if 'step' in df_model.columns:
    df_model = df_model.drop(columns="step")
    print("Dropped 'step' column from df_model")

# Redefine X after ensuring 'step' is dropped
y = df["isFraud"]
X = df_model.drop("isFraud", axis=1)

print("Final X columns:", X.columns.tolist())
print("X shape:", X.shape)
print("y shape:", y.shape)

# =============================================================================

# Cell 48: Create the preprocessor and pipeline
# Create the preprocessor
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numeric),
        ('cat', OneHotEncoder(drop='first', sparse_output=False), categorical)
    ],
    remainder='drop'
)

# Create the pipeline
pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('classifier', LogisticRegression(random_state=42, max_iter=1000))
])

print("Pipeline created successfully!")

# =============================================================================

# Cell 49: Split the data with random_state for reproducibility
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, stratify=y, random_state=42)

print(f"Training set shape: {X_train.shape}")
print(f"Test set shape: {X_test.shape}")

# =============================================================================

# Cell 50: Fit the pipeline
pipeline.fit(X_train, y_train)
print("Pipeline fitted successfully!")

# =============================================================================

# Cell 51: Make predictions and print classification report
# Make predictions
y_pred = pipeline.predict(X_test)

# Print classification report
print("Classification Report:")
print(classification_report(y_test, y_pred))

# =============================================================================

# Cell 52: Create and plot confusion matrix
# Create confusion matrix
cm = confusion_matrix(y_test, y_pred)

# Plot confusion matrix
plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
            xticklabels=['Not Fraud', 'Fraud'], 
            yticklabels=['Not Fraud', 'Fraud'])
plt.title('Confusion Matrix')
plt.ylabel('True Label')
plt.xlabel('Predicted Label')
plt.show()

# =============================================================================
# SUMMARY OF FIXES APPLIED:
# =============================================================================
# 1. Added check to ensure 'step' column is dropped from df_model
# 2. Added sparse_output=False to OneHotEncoder to prevent sparse matrix issues
# 3. Added max_iter=1000 to LogisticRegression to prevent convergence warnings
# 4. Added random_state=42 for reproducibility
# 5. Added proper error handling and debugging prints
# 6. Added confusion matrix visualization
# ============================================================================= 