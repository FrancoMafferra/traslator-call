import { getUiTexts } from "../i18n/uiTexts";

function ConnectionStatus({ status, language }) {
  const t = getUiTexts(language);

  const translatedStatus =
    t.connectionStatuses[status] || status;

  return (
    <div className="status">
      {t.status}: <strong>{translatedStatus}</strong>
    </div>
  );
}

export default ConnectionStatus;