


//Bootstrap
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
// eslint-disable-next-line
import NavDropdown from 'react-bootstrap/NavDropdown';

//CSS
import 'bootstrap/dist/css/bootstrap.min.css';

function Navigation() {
  return (
    <>
        <Navbar expand="lg" className="bg-body-tertiary" data-bs-theme="dark">
            <Container>
                <Navbar.Brand href="/home">HME Tools App</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/home">Home</Nav.Link>
                        <Nav.Link href="/inventory">Inventory</Nav.Link>
                        { // Hiding stale order function as it is not needed at this time
                        /**<Nav.Link href="/staleOrder">Stale Order</Nav.Link>**/
                        }
                        <Nav.Link href="/labels">Labels</Nav.Link>
                        {/** <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">
                            Another action
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">
                            Separated link
                            </NavDropdown.Item>
                        </NavDropdown>**/ }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        
    </>
  );
}

export default Navigation;