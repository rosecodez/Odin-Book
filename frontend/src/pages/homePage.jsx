import Home from "../components/home"

export default function HomePage({ isAuthenticated, setIsAuthenticated, isVisitor, setIsVisitor} ) {
    return(
        <Home isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} isVisitor={isVisitor} setIsVisitor={setIsVisitor} />
    )
}