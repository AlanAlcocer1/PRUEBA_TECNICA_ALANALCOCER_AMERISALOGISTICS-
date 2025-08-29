# spacex_analysis_api.py
from fastapi import FastAPI
import requests
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from io import BytesIO
import base64
from fastapi.middleware.cors import CORSMiddleware


# Inicializar FastAPI
app = FastAPI(title="SpaceX Analytics API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Agrega tu URL de frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ---------------------------
# 1️⃣ Funciones de procesamiento
# ---------------------------

def get_launch_data():
    """Obtiene datos de SpaceX y prepara un DataFrame"""
    launches = requests.get("https://api.spacexdata.com/v4/launches").json()
    rockets = requests.get("https://api.spacexdata.com/v4/rockets").json()
    rocket_map = {r['id']: r['name'] for r in rockets}

    df = pd.DataFrame(launches)
    df['date_utc'] = pd.to_datetime(df['date_utc'])
    df['year'] = df['date_utc'].dt.year
    df['rocket_name'] = df['rocket'].map(rocket_map)
    df['success'] = df['success'].fillna(False)
    return df

def df_to_base64_plot(df, plot_func):
    """Genera un gráfico, lo convierte a base64 y lo retorna"""
    buf = BytesIO()
    plot_func(df)
    plt.tight_layout()
    plt.savefig(buf, format='png')
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read()).decode('utf-8')
    plt.close()
    return img_base64

# ---------------------------
# 2️⃣ Funciones de gráficos
# ---------------------------

def plot_launches_per_year(df):
    plt.figure(figsize=(10,5))
    sns.countplot(data=df, x='year', palette='viridis')
    plt.title('Cantidad de lanzamientos por año')
    plt.xticks(rotation=45)

def plot_success_by_rocket(df):
    plt.figure(figsize=(10,5))
    sns.countplot(data=df, x='rocket_name', hue='success', palette='Set2')
    plt.title('Éxito vs Fallos por tipo de cohete')
    plt.xticks(rotation=45)

def avg_time_between_launches(df):
    df_sorted = df.sort_values('date_utc')
    df_sorted['diff_days'] = df_sorted['date_utc'].diff().dt.days
    avg_days = df_sorted['diff_days'].mean()
    return avg_days

# ---------------------------
# 3️⃣ Cargar datos global
# ---------------------------

df_launches = get_launch_data()

# ---------------------------
# 4️⃣ Endpoints
# ---------------------------

@app.get("/charts/launches-per-year")
def chart_launches_per_year():
    """Devuelve gráfico de lanzamientos por año en base64"""
    img_base64 = df_to_base64_plot(df_launches, plot_launches_per_year)
    return {"image": img_base64}

@app.get("/charts/success-by-rocket")
def chart_success_by_rocket():
    """Devuelve gráfico de éxito vs fallos por cohete en base64"""
    img_base64 = df_to_base64_plot(df_launches, plot_success_by_rocket)
    return {"image": img_base64}

@app.get("/stats/avg-time-between-launches")
def stat_avg_time_between_launches():
    """Devuelve tiempo promedio entre lanzamientos"""
    avg_days = avg_time_between_launches(df_launches)
    return {"avg_days_between_launches": avg_days}

@app.get("/launches")
def get_launches():
    """Devuelve datos crudos de lanzamientos resumidos"""
    df = df_launches.copy()
    df = df[['name', 'date_utc', 'rocket_name', 'success']]
    df['date_utc'] = df['date_utc'].dt.strftime('%Y-%m-%d')
    return df.to_dict(orient='records')


#uvicorn spacex_analysis_api:app --reload
