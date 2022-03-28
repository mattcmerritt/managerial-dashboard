const Navbar = () => {

    const SwitchView = async () => {

        let title, patientIn, patientCharts, staffIn, staffCharts;
        const ActiveView = new Promise((resolve, reject) => {
            title = document.getElementById("title");
            patientIn = document.getElementsByClassName("patientDataIn")[0];
            patientCharts = document.getElementById("patientChartsDiv");
            staffIn = document.getElementsByClassName("staffDataIn")[0];
            staffCharts = document.getElementById("staffChartsDiv");

            resolve();
        });
        
        ActiveView.then(() => {
            if (patientCharts.style.display === "flex") {
                title.innerHTML = "Managerial Dashboard - Staff Data";
                if (patientIn !== undefined) {
                    patientIn.style.display = "none";
                }
                patientCharts.style.display = "none";

                if (staffIn !== undefined) {
                    staffIn.style.display = "block";
                }
                staffCharts.style.display = "flex";
            } else {
                title.innerHTML = "Managerial Dashboard - Patient Data";
                if (patientIn !== undefined) {
                    patientIn.style.display = "block";
                }
                patientCharts.style.display = "flex";

                if (staffIn !== undefined) {
                    staffIn.style.display = "none";
                }
                staffCharts.style.display = "none";
            }
        });
    }

    return (
        <nav className="navbar">
            <h1 id="title">Managerial Dashboard - Patient Data</h1>
            <button onClick={SwitchView}>Switch Views</button>
        </nav>
    );
}

export default Navbar;