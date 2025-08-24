const Asterisk = ({
  className,
  id,
  lineClass,
}: {
  lineClass?: string;
  className?: string;
  id?: string;
}) => {
  return (
    <div className={`asterisk-container size-[inherit] ${className}`} id={id}>
      {[...Array(13)].map((_, i) => (
        <div key={i} className={`asterisk-line ${lineClass}`}></div>
      ))}
    </div>
  );
};

Asterisk.displayName = "Asterisk";

export default Asterisk;
