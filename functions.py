#!functions.py 
import csv
import numpy as np

def checkList(lst):
    
    ele = lst[0]
    chk = True
    
    # Comparing each element with first item 
    for item in lst:
        if ele != item:
            chk = False
            break;
              
    if (chk == True): 
        return "equal"
        
        # result.append("win")
    else: 
        return "not equal"


# read rules cvs file
def csv_rewrite_array(array):
    with open('active_game.csv') as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            array.append(row)
    
def csv_write(array):
    with open('active_game.csv', 'w') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerows(array)

def csv_read():
    with open('active_game.csv') as csvfile:
        reader = csv.reader(csvfile)
        row = []
        for i in reader:
            row.append(i)
    return row
    