const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first()
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id })
  },

  getWord(db, word_id) {
    return db
      .from('word')
      .select('*')
      .where({ id: word_id })
  },

  async onCorrectGuess(db, word_id, user_id) {
    return db
      .raw(`
            UPDATE word SET correct_count = correct_count + 1 WHERE id = ${word_id};
            UPDATE language SET total_score = total_score + 1 WHERE user_id = ${user_id};
            `)
      .then(async () => {
        const updatedLang = await this.getUsersLanguage(db, user_id)
        const updatedWord = await this.getWord(db, word_id);
        return {
          updatedLang,
          updatedWord: updatedWord[0],
        }
      })
  },

  onWrongGuess(db, word_id, user_id) {
    return db
      .raw(`UPDATE word SET incorrect_count = incorrect_count + 1 WHERE id = ${word_id};`)
      .then(async () => {
        const updatedLang = await this.getUsersLanguage(db, user_id)
        const updatedWord = await this.getWord(db, word_id);
        return {
          updatedLang,
          updatedWord: updatedWord[0],
        }
      })
  }
}

module.exports = LanguageService
