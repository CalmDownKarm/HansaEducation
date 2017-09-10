"""Handles parsing the CS Ranking Website - Copy the ranked element table to a file 
and then using beautifulsoup to parse it"""
import pandas as pd
import pprint
from bs4 import BeautifulSoup as bs
from os import listdir
from os.path import isfile, join

def extract_table_data(file):
    with open(file) as f:
        soup = bs(f.read,"html.parser")
        if soup:
            pass
        else:
            print("No soup for you")
        