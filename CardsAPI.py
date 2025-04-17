import pandas as pd
import mysql.connector

# Load the Excel file
df = pd.read_excel('C:/Users/David/Desktop/50 Magic cards for project.xlsx', engine='openpyxl')

# Optional: Make sure column names match exactly
df.columns = ['Name', 'Type', 'Rarity', 'Mana', 'Power', 'Description']

# Connect to MySQL
conn = mysql.connector.connect(
    host='buynbattledb.cdw0oiyeqvba.us-west-1.rds.amazonaws.com',
    user='admin',
    password='BuyNBattleP4SS',
    database='BuyAndBattle_DB'
)
cursor = conn.cursor()

# Insert rows into the Cards table
for _, row in df.iterrows():
    sql = """
    INSERT INTO Cards (Name, Type, Rarity, Mana, Power, Description)
    VALUES (%s, %s, %s, %s, %s, %s)
    """
    values = tuple(row)
    cursor.execute(sql, values)

# Commit changes and close connection
conn.commit()
cursor.close()
conn.close()
