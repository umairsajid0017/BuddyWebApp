interface MainProps {
  children: React.ReactNode;
}
const Main: React.FC<MainProps> = ({ children }) => {
  return (
    <main className="flex-grow">
      <div className="mx-auto mb-40 max-w-7xl px-6 py-6">{children}</div>
    </main>
  );
};

export default Main;
