import sqlite3
import ast


connection = sqlite3.connect('participants.db')
cursor = connection.cursor()
cursor.execute("SELECT * FROM experimentdata") #turkdemo
results = cursor.fetchall()

null=None
true=True
false=False

output = []
header = []


for r in results:

    try:
        dic = eval(r[16].encode('ascii','ignore'))
    except:
        pass
    #print dic['assignmentId']

    if 'data' in dic:
        trial = dic['data'] 


        for t in trial:
            if type(t['trialdata'])==list:
                if len(header) == 0:
                    header.append('worker_id')
                    header.append('assignment_id')
                    header.append('current_trial')
                    header.append('dateTime')
                    header.extend(["r"+str(x+1) for x in xrange(len(t['trialdata']))])
                    output.append(','.join(map(str, header)))

                out = [dic['workerId'],dic['assignmentId'],
                     t['current_trial'], t['dateTime']]
                out.extend(t['trialdata'])
                

                output.append(','.join(map(str, out)))
   # except:
     #   print "didn't work"
      #  pass    

for o in output:
    print o
with open('data.csv','w') as f:
    f.write('\n'.join(output))
    f.close()
    

