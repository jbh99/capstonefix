import turtle
print("3이상 10이하의 숫자로 입력해주세요.")
print("입력한 숫자를 정렬하여 가장 작은 숫자의 도형으로 그리고 시작합니다.")
data=[]
many=int(input("몇개의 숫자로 입력할까요?"))
for i in range(0,many,1):
    num=int(input("숫자 입력하세요:"))
    data.append(num)
option=[1,2,3,4]
print("3개의 정렬 중에서 하나를 숫자로 선택해주세요")
print("")
print("1. 버블정렬")
print("2. 삽입정렬")
print("3. 선택정렬")
    
a = int(input("당신의 선택은? -> "))

if a==1:
    
    for k in range(len(data)-1,0,-1):
        for j in range(0,k,1):
             while data[j]>=data[j+1]:
                temp=data[j]
                data[j]=data[j+1]
                data[j+1]=temp
             print(data)

    turtle.shape("turtle")
 
    n=0
    while n<= many-1:
        b=data[n]
        l = 0

        while l < b:
            turtle.forward(100)
            turtle.left(360/b)
            l=l+1
        
        n=n+1
                
                    
elif a==2:
    for k in range(1,len(data)):
        temp=data[k]
        j=k-1
        while j>=0 and data[j]>temp:
            data[j+1]=data[j]
            j=j-1
            data[j+1]=temp
        print(data)

    turtle.shape("turtle")

    n=0
    while n<= many-1:
        b=data[n]
        l = 0

        while l < b:
            turtle.forward(100)
            turtle.left(360/b)
            l=l+1
        
        n=n+1
                    
elif a==3:
    for k in range (0,len(data)-1):
        m=k
        for j in range(k+1,len(data)):
            if data[j]<data[m]:
                m = j
            temp=data[k]
            data[k]=data[m]
            data[m]=temp
            print(data)

    turtle.shape("turtle")

    n=0
    while n<= many-1:
        b=data[n]
        l = 0

        while l < b:
            turtle.forward(100)
            turtle.left(360/b)
            l=l+1
        
        n=n+1

else:
    print("")
    print("잘못 선택하셨습니다.")
    print("다시 선택해주세요.")
     




    

    
