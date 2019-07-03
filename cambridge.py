from bs4 import BeautifulSoup
import csv
from fake_useragent import UserAgent
import requests
from time import sleep
from unidecode import unidecode
from word_list import word_list


class Entry:
    def __init__(self, substantive, gender, plural, english):
        self.substantive = substantive
        self.gender = gender
        self.plural = plural
        self.english = english

    def as_list(self):
        return [self.substantive, self.gender, self.plural, self.english]

    def pretty_print(self):
        print(f"Substantiv: {self.substantive} | Gender: {self.gender} | "
              f"Plural: {self.plural} | English: {self.english} \n")


class Lookup:
    def __init__(self, substantive):
        self.substantive = substantive
        self.soup = self.lookup()

    def lookup(self):
        url = ("https://dictionary.cambridge.org/dictionary/german-english/" +
               unidecode(self.substantive.lower()))
        header = {"User-Agent": UserAgent().random}

        r = requests.get(url, headers=header)

        search = r.request.url[59:]
        print(search)
        if "?q=" in search:
            split = search.split("?q=")
            print(split)
            if split[0] in split[1]:
                self.substantive = split[0].capitalize()
                return BeautifulSoup(r.text, 'html.parser')
            elif split[1] in split[0]:
                return BeautifulSoup(r.text, 'html.parser')
            else:
                return False
        else:
            return BeautifulSoup(r.text, 'html.parser')

    def create_entry(self):
        if self.soup:
            noun_section = self.is_noun()
            if noun_section:
                return Entry(self.substantive,
                             self.get_gender(noun_section),
                             self.get_plural(noun_section),
                             self.get_english(noun_section))
            else:
                return Entry(self.substantive, "None", "None", "None")
        else:
            return Entry(self.substantive, "Search Fail",
                         "Search Fail", "Search Fail")

    def is_noun(self):
        pos_list = self.soup.find_all('span', 'pos')
        noun_section = self.noun_section(pos_list)

        return noun_section if noun_section else None

    def noun_section(self, pos_list):
        for index, item in enumerate(pos_list):
            if item.text == "noun":
                return item.parent.parent.parent.parent
        return None

    def get_gender(self, noun_section):
        gen = noun_section.find_all('span', 'gc')
        genders = ['feminine', 'masculine', 'neuter']
        if len(gen) > 1:
            for item in gen:
                if item.text in genders:
                    return item.text
        elif len(gen) == 1:
            return gen[0].text
        else:
            return "Gender Unlisted"

    def get_plural(self, noun_section):
        inf = noun_section.find_all('span', 'inf')
        if len(inf) > 1:
            plural = inf[1].text
            if plural[0] == "-":
                return self.substantive + plural[1:]
            else:
                return plural
        else:
            return "No Plural"

    def get_english(self, noun_section):
        trans_list = noun_section.find_all('span', 'trans')
        return self.find_trans(trans_list)

    def find_trans(self, trans_list):
        if trans_list:
            for item in trans_list:
                if " " not in item.text:
                    return item.text
        else:
            return "Trans Unlisted"


class CSVWriter:
    def __init__(self, entries, filename):
        self.entries = entries
        self.filename = filename

    def write_csv(self):
        with open(self.filename, 'w', encoding='utf-8', newline='') as csvFile:
            writer = csv.writer(csvFile)
            writer.writerows(self.entries)
        print(f"Finished creating {self.filename}")


def pause(index):
    sleep(.250)
    if index % 25 == 0:
        sleep(.750)
    if index % 100 == 0:
        sleep(1)
    if index % 1000 == 0:
        sleep(3)


def main():
    entries = []

    for index, item in enumerate(word_list):
        lookup = Lookup(item[1])
        entry = lookup.create_entry()
        entry.pretty_print()
        entries.append(entry.as_list())
        pause(index)

    writer = CSVWriter(entries, "oxford_list.csv")
    writer.write_csv()


if __name__ == "__main__":
    main()
