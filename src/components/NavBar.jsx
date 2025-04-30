import Logo from "./Logo";

export default function NuvBar({ children }) {   
    return  (<nav className="nav-bar">
       <Logo />
      {children}</nav>);
}