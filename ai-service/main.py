from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from sklearn.linear_model import LinearRegression
import mysql.connector

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

def get_db():
    return mysql.connector.connect(host="localhost", user="root", password="", database="smart_retail")

@app.get("/predict-stock-out/{product_id}")
def predict_stock_out(product_id: int):
    db = get_db()
    # 1. Njibu l-ventes dyal had l-produit
    query_sales = f"SELECT DATE(created_at) as date, SUM(quantity) as qty FROM sales WHERE product_id={product_id} GROUP BY DATE(created_at)"
    df_sales = pd.read_sql(query_sales, db)
    
    # 2. Njibu s-stock li baqi deba
    query_stock = f"SELECT stock FROM products WHERE id={product_id}"
    cursor = db.cursor()
    cursor.execute(query_stock)
    current_stock = cursor.fetchone()[0]
    db.close()

    if len(df_sales) < 2:
        return {"status": "low_data", "message": "Khassna ventes dyal 2 iyam"}

    # 3. IA: Ch-7al k-n-bi3ou f l-nhar?
    df_sales['day_index'] = range(len(df_sales))
    model = LinearRegression().fit(df_sales[['day_index']], df_sales['qty'])
    avg_sales_per_day = model.predict([[len(df_sales)]])[0]

    # 4. 7sab imta i-ssala
    days_left = current_stock / max(avg_sales_per_day, 1)

    return {
        "product_id": product_id,
        "current_stock": current_stock,
        "predicted_days_left": round(days_left),
        "alert": "URGENT" if days_left < 3 else "OK"
    }