interface MainProps {
    children: React.ReactNode;
}
const Main: React.FC<MainProps> = ({children}) => {
    return(

        <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
)
}


export default Main;