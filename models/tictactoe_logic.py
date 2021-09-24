#!tictactoe_logic.py

winningRules1 = [
    [0 , 1 , 2],
    [3 , 4 , 5],
    [6 , 7 , 8],
    [0 , 3 , 6],
    [1 , 4 , 7],
    [2 , 5 , 8],
    [0 , 4 , 8],
    [2 , 4 , 6]
]

result = []
count = 0

# Checking if all 
# elements in a List are same 
def checkList(lst):
    ele = lst[0]
    chk = True
    
    # Comparing each element with first item 
    for item in lst:
        if ele != item:
            chk = False
            break;
              
    if (chk == True and count < 10): 
        result.append("win")
        

def winningRule(msg):
    global count
    count += 1
    for i in range(len(winningRules1)):
        
        a = winningRules1[i]
        for item in range(3):
            
            if(a[item] == int(msg[0])):
                a[item] = [str(msg[1])]
                checkList(a)