function ConnectionStatus({ status }) {
  return (
    <div className="status">
      Estado: <strong>{status}</strong>
    </div>
  );
}

export default ConnectionStatus;