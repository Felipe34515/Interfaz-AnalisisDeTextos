import pandas as pd
import unicodedata
import re
import nltk
from nltk.corpus import stopwords
from sklearn.base import BaseEstimator, TransformerMixin
import inflect
from nltk import word_tokenize
import contractions
from nltk.stem import SnowballStemmer, WordNetLemmatizer

class TextCleaning(BaseEstimator,TransformerMixin):
    def __init__(self,stopwords=stopwords.words('spanish')):
        self.stopwords = stopwords

    #Transformación a clase del método remove_non_ascii realizado anteriormente
    def remove_non_ascii(self, words):
        new_words = []
        for word in words:
            new_word = unicodedata.normalize('NFKD', word).encode('ascii', 'ignore').decode('utf-8', 'ignore')
            new_words.append(new_word)
        return new_words

    #Transformación a clase del método lowercase realizado anteriormente
    def lowercase(self, words):
        new_words = []
        for word in words:
            new_word = word.lower()
            new_words.append(new_word)
        return new_words

    #Transformación a clase del método remove_punctuation realizado anteriormente
    def remove_punctuation(self, words):
        new_words = []
        for word in words:
            new_word = re.sub(r'[^\w\s]', '', word)
            if new_word != '':
                new_words.append(new_word)
        return new_words

    #Transformación a clase del método replace_numbers realizado anteriormente
    def replace_numbers(self, words):
        p = inflect.engine()
        new_words = []
        for word in words:
            if word.isdigit():
                new_word = p.number_to_words(word)
                new_words.append(new_word)
            else:
                new_words.append(word)
        return new_words

  #Transformación a clase del método remove_stopwords realizado anteriormente
    def remove_stopwords(self, words):
        new_words = []
        for word in words:
            if word not in self.stopwords:
                new_words.append(word)
        return new_words

  #Transformación a clase del método stem_words realizado anteriormente
    def stem_words(self, words):
        stemmer = SnowballStemmer('spanish')
        stems = []
        for word in words:
            stem = stemmer.stem(word)
            stems.append(stem)
        return stems

    #Transformación a clase del método lemmatize_verbs realizado anteriormente
    def lemmatize_verbs(self, words):
        lemmatizer = WordNetLemmatizer()
        lemmas = []
        for word in words:
            lemma = lemmatizer.lemmatize(word, pos='v')
            lemmas.append(lemma)
        return lemmas

  #Transformación a clase del método full_preprocessing realizado anteriormente
    def full_preproccesing(self, words):
        words = self.remove_non_ascii(words)
        words = self.lowercase(words)
        words = self.remove_punctuation(words)
        words = self.replace_numbers(words)
        words = self.remove_stopwords(words)
        return words

  #Transformación a clase del método full_lematize realizado anteriormente
    def full_lemmatize(self, words):
        words = self.stem_words(words)
        words = self.lemmatize_verbs(words)
        return words

    def fit(self,x,y=None):
      return self

    def transform(self,x,y=None):
        x_train_n = pd.Series(x)
        x_train_n = x_train_n.apply(contractions.fix)
        x_train_n = x_train_n.apply(word_tokenize)
        x_train_n = x_train_n.apply(lambda x: self.full_preproccesing(x))
        x_train_n = x_train_n.apply(lambda x: self.full_lemmatize(x))
        x_train_n = x_train_n.apply(lambda x: ' '.join(map(str, x)))
        return x_train_n