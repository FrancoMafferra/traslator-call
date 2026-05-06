function LanguageSelector({
  spokenLanguage,
  listenLanguage,
  setSpokenLanguage,
  setListenLanguage,
  saveLanguageConfig,
  languageSaved,
}) {
  return (
    <div className="language-box">
      <label>
        Yo hablo
        <select
          value={spokenLanguage}
          onChange={(e) =>
            setSpokenLanguage(e.target.value)
          }
        >
          <option value="es">Español</option>
          <option value="en">Inglés</option>
          <option value="it">Italiano</option>
        </select>
      </label>

      <label>
        Quiero escuchar en
        <select
          value={listenLanguage}
          onChange={(e) =>
            setListenLanguage(e.target.value)
          }
        >
          <option value="es">Español</option>
          <option value="en">Inglés</option>
          <option value="it">Italiano</option>
        </select>
      </label>

      <button onClick={saveLanguageConfig}>
        Guardar idiomas
      </button>

      {languageSaved && (
        <p className="saved-message">
          Idiomas configurados
        </p>
      )}
    </div>
  );
}

export default LanguageSelector;