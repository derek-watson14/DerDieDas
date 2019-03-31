import csv
import pattern.text.de as ptDE  # gender, singularize, pluralize, parse
import pattern.text.en as ptEN  # pluralize
import sqlite3
from yandex_translate import YandexTranslate

ytranslator = YandexTranslate('trnsl.1.1.20190305T165343Z.8aca6e0d82f63edb.70c64924b88d2b381986b63fc18fec4958e4464f')

FLAG = 1
UNFLAG = 0

class Database:
    def __init__(self, database): #'word_data.db'
        self.database = database
        self.connection = self.connect()
        self.cursor = self.getCursor()
    def __str__(self):
        return f"\n{self.database} Menu:"
    def connect(self):
        try:
            connection = sqlite3.connect(self.database)
            return connection
        except:
            print("**Failure to connect to database**")
    def getCursor(self):
        cursor = self.connection.cursor()
        return cursor
    def commit(self):
        try:
            self.connection.commit()
        except:
            SystemError("**Unable to commit changes**")
    def closeConnection(self):
        self.connection.close()
        print("**Connection Closed**")
    def newTable(self):
        newTable = self.scrub(input("Alphanumeric characters only. Cannot begin with a number. Press 1 to cancel: "))
        if newTable[0] == "1":
            print("**Operation cancelled**")
        elif newTable[0].isdigit():
            print("**Invalid table name**")
        else:
            self.cursor.execute(f""" CREATE TABLE {newTable}(wordID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, 
                                                            word_en	TEXT NOT NULL,
                                                            word_de	TEXT NOT NULL,
                                                            gender	TEXT NOT NULL,
                                                            plural_de	TEXT,
                                                            en_de_same	INTEGER NOT NULL DEFAULT 0,
                                                            not_noun	INTEGER NOT NULL DEFAULT 0,
                                                            no_gender	INTEGER NOT NULL DEFAULT 0,
                                                            w_not_pl	INTEGER NOT NULL DEFAULT 0,
                                                            pl_not_ppl	INTEGER NOT NULL DEFAULT 0); """ )
            print(f'New table "{newTable}" created!')
    def scrub(self, newTable):
        # TO DO: reseach .join function
        return ''.join(chr for chr in newTable if chr.isalnum())
    def chooseTable(self):
        print()
        tables = self.cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        counter = 1
        choices = []
        tableNames = ["tableNames[0]"]
        for table in tables:
            choices.append(str(counter))
            tableNames.append(table[0])
            print(f'{counter}. Table "{table[0]}"')
            counter += 1
        choices.append(str(counter))
        print(f"{counter}. Quit")
        choice = None
        while choice not in choices:
            choice = input(f"Enter a number 1 - {counter} to choose table: ")
        if choice == str(counter):
            print("**Quit**")
            return None
        else:
            print("Table Chosen: " + tableNames[int(choice)])            
            return tableNames[int(choice)]  
    def dropTable(self, table):
        choice = self.confirmation("drop table")
        if choice == "1":
            self.cursor.execute(f"DROP TABLE {table}")
            print("**Table dropped**")
        else:
            print("**Operation cancelled**")
    def confirmation(self, action):
        choice = None
        while choice not in ["1", "2"]:
            choice = input(f"Confirmation: Enter '1' to {action} or '2' to cancel: ")
        return choice
 
class Table(Database):
    def __init__(self, database, table):
        super().__init__(database)
        self.table = table
        self.csv = "main_wordlist.txt"
    def __str__(self):
        return f"\n{self.database}, {self.table} Menu:"
    def CSVintoTable(self):
        self.selectCSV()
        wordList = self.CSVtoWordList()
        if wordList:
            self.CSVtoDB(wordList)
        else:
            return
    def selectCSV(self):
        print("\nExpected CSV format: word_en,word_de,gender,plural_de")
        print(f"Default CSV: {self.csv}.")
        choice = None
        while choice not in ["1", "2"]:
            choice = input(f"Enter 1 to upload {self.csv} or 2 to change: ")
        if choice == "2":
            self.csv = input("New csv filename: ")
            print(f"New CSV: {self.csv}")
    def CSVtoWordList(self):
        wordList = []
        try:
            with open(self.csv, 'r', encoding='utf8') as csvContents:
                csvList = csv.reader(csvContents)
                for row in csvList:
                    wordData = ItemSetter(word_en=row[0], word_de=row[1], gender=row[2], plural_de=row[3])
                    wordList.append(wordData)
            return wordList
        except:
            print(f"**Unable to open CSV: {self.csv}**")
            return None
    def CSVtoDB(self, wordList):
        for word in wordList: 
            self.cursor.execute(f""" INSERT INTO {self.table}
                                     (word_en, word_de, gender, plural_de, en_de_same, not_noun, no_gender, w_not_pl, pl_not_ppl) 
                                     VALUES 
                                     (?, ?, ?, ?, ?, ?, ?, ?, ?) """,  
                                     (word.word_en, word.word_de, word.gender, word.plural_de, word.en_de_same, 
                                      word.not_noun, word.no_gender, word.w_not_pl, word.pl_not_ppl))                                        
        self.commit()
        print(f"**{self.csv} uploaded to {self.database}**")
    def getFlaggedItems(self, flag):
        sqlList = self.cursor.execute(f"SELECT wordID, word_en, word_de, gender, plural_de FROM {self.table} WHERE {flag} = {FLAG}")
        flaggedList = self.makeFlaggedList(flag, sqlList)
        return flaggedList
    def makeFlaggedList(self, flag, sqlList):
        flaggedList = []
        for item in sqlList:
            query_match = Item(database=self.database, 
                                table=self.table,
                                flag=flag,
                                wordID=item[0], 
                                word_en=item[1], 
                                word_de=item[2], 
                                gender=item[3], 
                                plural_de=item[4])
            flaggedList.append(query_match)
        return flaggedList  

class Item(Table):
    def __init__(self, database, table, flag, wordID, word_en, word_de, gender, plural_de):
        super().__init__(database, table)
        self.flag = flag
        self.wordID = wordID
        self.word_en = word_en
        self.word_de = word_de
        self.gender = gender
        self.plural_de = plural_de
    def __str__(self):
        return f"\n{self.database}, {self.table}, wordID = {self.wordID}:\nflag: {self.flag} | word_en: {self.word_en}, word_de: {self.word_de}, gender: {self.gender}, plural_de: {self.plural_de}\n"
    def updateField(self, field):
        update = self.getFieldUpdate(field)
        self.cursor.execute(f" UPDATE {self.table} SET {field} = ? WHERE wordID={self.wordID} ", (update,))
        self.commit()
        print(f"**Field {field} updated**")
    def getFieldUpdate(self, field):
        update = ""
        while update.isalpha() == False:
            update = input(f"Please enter alphabetic string for field '{field}' of word {self.wordID}: ")
        return update
    def deleteEntry(self):
        choice = self.confirmation(f"delete item {self.wordID} ")
        if choice == "1":
            self.cursor.execute(f"DELETE FROM {self.table} WHERE wordID = {self.wordID}")
            self.commit()
            print("**Entry Deleted**")
        else:
            print("**Operation cancelled**")
    def updateFlag(self, change):
        if change not in [FLAG, UNFLAG]:
            print("**Invalid flag change requested**")
        else:
            self.cursor.execute(f" UPDATE {self.table} SET {self.flag} = ? WHERE wordID={self.wordID} ", (change,))
            self.commit()
            if change == FLAG:
                print(f"**Flagged for {self.flag}**")
            elif change == UNFLAG:
                print(f"**Flag {self.flag} removed")

class ItemSetter:
    def __init__(self, wordID=None, word_en=None, word_de=None, gender=None, plural_de=None):
        self.wordID = wordID
        self.word_en = word_en
        self.word_de = word_de
        self.gender = gender
        self.plural_de = plural_de
        self.en_de_same = self.set_en_de_same()
        self.not_noun = self.set_not_noun()
        self.no_gender = self.set_no_gender()
        self.w_not_pl = self.set_w_not_pl()
        self.pl_not_ppl = self.set_pl_not_pl()

    def set_en_de_same(self):
        return FLAG if self.word_de == self.word_en else UNFLAG
    def set_not_noun(self):
        return FLAG if ptDE.parse(self.word_de)[len(self.word_de):] != "/NN/B-NP/O" else UNFLAG
    def set_no_gender(self):
        return FLAG if self.gender not in ["m", "f", "n"] else UNFLAG
    def set_w_not_pl(self):
        return FLAG if self.word_de[0] != self.plural_de[0] else UNFLAG
    def set_pl_not_pl(self):
        return FLAG if self.plural_de != ptDE.pluralize(self.plural_de) else UNFLAG

def databaseMenu(database='word_data.db'):
    databaseObject = Database(database)
    options = ["1", "2", "3", "4"]
    choice = None
    while choice not in options:
        choice = databaseMenuOptions(databaseObject, options)
        while choice != "4":
            if choice == "1":
                database = changeDatabase()
                if database:
                    databaseMenu(database)
            elif choice == "2":
                databaseObject.newTable()      
            elif choice == "3":
                table = databaseObject.chooseTable()
                if table:
                    tableObject = Table(database, table)
                    tableMenu(tableObject)
                else:
                    print("No table selected\n")
            choice = databaseMenuOptions(databaseObject, options)
    print("**Quit**")
    return

def databaseMenuOptions(databaseObject, options):
    print(databaseObject)
    print("1. Change Database")
    print(f"2. New Table in '{databaseObject.database}'")
    print(f"3. Edit Exsisting Table in '{databaseObject.database}'")
    print("4. Quit")
    choice = input(f"Please select an option {options[0]} - {options[-1]}: ")
    return choice

def changeDatabase():
    newDB = ""
    while newDB[-3:] != ".db" or len(newDB) < 4:  
        print("Filename must include '.db' file extension. If database does not exsist it will be created. Enter 1 to cancel.")
        newDB = input("New database filename: ")
        if newDB == "1":
            print("**Operation cancelled**")
            return None
    return newDB

def tableMenu(tableObject):
    options = ["1", "2", "3", "4", "5", "6", "7", "8"]
    flags = ["en_de_same", "not_noun", "no_gender", "w_not_pl", "pl_not_ppl"]
    choice = None
    while choice not in options:
        choice = tableMenuOptions(tableObject, options)
        while choice != "8":
            if choice == "1":
                tableObject.dropTable(tableObject.table)
                return
            elif choice == "2":
                tableObject.CSVintoTable()
            elif choice in options[2:7]:
                flaggedItemList = tableObject.getFlaggedItems(flags[int(choice) - 3])
                itemMenu(flaggedItemList)
            choice = tableMenuOptions(tableObject, options)
    print("**Quit**")
    return


def tableMenuOptions(tableObject, options):
    print(tableObject)
    print(f"1. Drop table '{tableObject.table}'")
    print(f"2. Upload formatted CSV to '{tableObject.table}'")
    print(f"3. Review items in '{tableObject.table}' where German and English singular match")
    print(f"4. Review items in '{tableObject.table}' that my not be nouns according to the 'Pattern' module")
    print(f"5. Review items in '{tableObject.table}' that do not have a gender specified")
    print(f"6. Review items in '{tableObject.table}' where singular_de[0] does not match plural_de[0]")
    print(f"7. Review items in '{tableObject.table}' where 'Pattern' plural does not match plural given")
    print("8. Quit")
    choice = input(f"Please select an option {options[0]} - {options[-1]}: ")
    return choice

def itemMenu(flaggedItemList):
    options = ["1", "2", "3", "4", "5", "6", "7", "8"]
    attributes = ["word_en", "word_de", "gender", "plural_de"]
    for item in flaggedItemList:
        choice = None
        while choice not in options:
            choice = itemMenuOptions(item, options, attributes)
            while choice != "8":
                if choice == "1":
                    item.updateFlag(UNFLAG)
                    break
                elif choice == "2":
                    item.deleteEntry()
                    break
                elif choice in options[2:6]:
                    item.updateField(attributes[int(choice) - 3])
                    break
                elif choice == "7":
                    print("**Next**")
                    break
                choice = itemMenuOptions(item, options, attributes)
        if choice == "8":
            print("**Quit**")
            return

def itemMenuOptions(item, options, attributes):
    print(item)
    print(f"1. Remove flag '{item.flag}' from item wordID='{item.wordID}'")
    print(f"2. Delete item wordID='{item.wordID}'")
    for i in range(4):
        print(f"{(i + 3)}. Edit attribute '{attributes[i]}' for item wordID='{item.wordID}'")
    print(f"7. Go to next item")
    print(f"8. Quit")
    choice = input(f"Please select an option {options[0]} - {options[-1]}: ")
    return choice


if __name__ == "__main__":
    databaseMenu()  
