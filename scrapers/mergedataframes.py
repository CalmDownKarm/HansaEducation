import pandas as pd 

df1 = pd.read_csv("../Output/FTManagement.csv")
df1 = df1.reset_index(drop = True)
df2 = pd.read_csv("../Output/MIMCompass.csv")
df2 = df2.reset_index(drop=True)
horizontal_stack = pd.concat([df1, df2], axis=1)
horizontal_stack.to_csv("../Output/merged.csv")