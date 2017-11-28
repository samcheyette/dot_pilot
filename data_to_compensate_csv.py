import csv
from collections import defaultdict

def get_bonus(file, find=["worker_id", "assignment_id", "bonus"]):
	bonus_dct = defaultdict(list)
	dct_find = {}

	with open(file,"r") as f:
		c = 0
		for row in f:
			row_f = row.replace("\n","")
			spl = row_f.split(",")
			if c == 0:

				for f in find:
					use = f
					if f in col_name_other:
						use = col_name_other[f]
					dct_find[f] = spl.index(use)

			else:

				ass_id = spl[dct_find[find[0]]]
				work_id = spl[dct_find[find[1]]]
				bonus = spl[dct_find[find[2]]]
				bonus_dct[(work_id,ass_id)].append(float(bonus))
			c += 1

	ret = []
	for k in bonus_dct:
		work_id = k[0]
		ass_id = k[1]
		bonus = max(bonus_dct[k])
		ret.append((work_id,ass_id,bonus))
	return ret



def output(bonuses, file, header=["worker_id", "assignmentId", "bonus"]):

	o = ",".join(header) + "\n"
	for b in bonuses:
		o += "%s,%s,%f\n" % b

	f = open(file, "w+")
	f.write(o)
	f.close()


def main(in_file, out_file, header):
	contents = get_bonus(in_file, header)
	output(contents, out_file, header)

if __name__ == "__main__":
	in_file = "data.csv"
	out_file = "data_conv.csv"
	header = ["worker_id", "assignment_id", "bonus"]
	col_name_other = {'bonus':'r11'}
	main(in_file,out_file, header)