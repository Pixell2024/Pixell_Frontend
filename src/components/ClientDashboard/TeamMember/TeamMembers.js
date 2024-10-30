import { useEffect, useState, useCallback } from "react";
import { FiSearch } from "react-icons/fi";
import InviteTeamModal from "../../../shared/utils/inviteTeamModal";
import { Typography } from "@mui/material";
import Swal from "sweetalert2";


import {
    Grid,
    TextField,
    InputAdornment,
    CircularProgress,
} from "@mui/material";
import axios from "axios";
import TeamMembersCard from "../../../shared/createForms/TeamMembersCard"


const Teams = () => {
    const [teamMembers, setTeamMembers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [completeAdmins, setCompleteAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(""); // Added search state
    const [searchTermForAdmin, setSearchTermForAdmin] = useState(""); // Added search state
    const [openModal, setOpenModal] = useState(false);
    const [inviteType, setInviteType] = useState(""); // Track if inviting Admin or Member
    // const [clientID, setClientId] = useState(null); // State to hold clientDetails
    const [isorganizationId, setOrganizationId] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);


    const serverURL = process.env.REACT_APP_URL;
    // Fetch clientDetails from localStorage
    const storedClientId = localStorage.getItem("clientId");

    // const [ClientArr,setClientArr]

    const fetchOrganizationID = async () => {
        console.log("in the function ", storedClientId);
        try {
            const token = localStorage.getItem("token");

            // Check if token exists
            if (!token) {
                throw new Error("No authentication token found. Please log in.");
            }

            const response = await axios.get(
                `${serverURL}/client/dashboard/${storedClientId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("response", response.data);

            // Check if the response is successful
            if (response.data.success) {
                const orgId = response?.data?.data?.organizationId;

                if (orgId) {
                    setOrganizationId(orgId);
                    await fetchTeamMembers(orgId);
                } else {
                    throw new Error("Organization ID not found in the response.");
                }
            } else {
                throw new Error("Failed to fetch organization data.");
            }
        } catch (err) {
            console.error("Error fetching Organization ID:", err.message || err);
        }
    };
    const fetchTeamMembers = async (id = isorganizationId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${serverURL}/client/dashboard?organizationId=${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response?.data?.success) {
                setTeamMembers(response.data.data);
                const adminsFiltered = response.data.data.filter(
                    (member) => member.userRoleId <= 2
                ); // Admins
                setAdmins(adminsFiltered);
                setCompleteAdmins(adminsFiltered);
                setLoading(false);
            } else {
                setError("Failed to fetch team members");
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching team members:", error);
            setError("Something went wrong!");
            setLoading(false);
        }
    };


    // Trigger fetchTeamMembers on component mount
    useEffect(() => {
        fetchOrganizationID();
    }, []); // Ensure the dependency array is properly closed

    // Filter admins and members from teamMembers state
    const members = teamMembers.filter((member) => member.userRoleId === 3); // Members

    const handleDelete = async (adminToDelete) => {
        setAnchorEl(null)

        Swal.fire({
            customClass: {
                container: "my-swal",
            },
            icon: "warning",
            text: "Do you want to delete?",
            showCancelButton: true,
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Perform the delete operation
                    const token = localStorage.getItem("token");

                    const response = await axios.delete(
                        `${serverURL}/client/delete/${adminToDelete._id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    if (response.data.success) {
                        Swal.fire({
                            customClass: {
                                container: "my-swal",
                            },
                            icon: "success",
                            text: response.data.message,
                            padding: "1em",
                            color: "green",
                        }).then(() => {
                            setAnchorEl(null)

                            if (response?.data?.success) {
                                setTeamMembers((prevTeamMembers) =>
                                    prevTeamMembers.filter((admin) => admin._id !== adminToDelete._id)
                                );
                                setAdmins((prevAdmins) =>
                                    prevAdmins.filter((admin) => admin._id !== adminToDelete._id)
                                );
                                setCompleteAdmins((prevCompleteAdmins) =>
                                    prevCompleteAdmins.filter((admin) => admin._id !== adminToDelete._id)
                                );
                            } else {
                                console.error("Failed to delete admin.");
                            }
                            // Refresh company data after deletion
                        });
                    }
                } catch (error) {
                    console.error("Error during deletion:", error);
                    Swal.fire({
                        icon: "error",
                        text: error.response?.data?.message || "An error occurred",
                        color: "black",
                    });
                    setAnchorEl(null)

                }
            }
        });
    };

    // Filter members by search term
    const filteredMembers = members.filter(
        (member) =>
            member.name &&
            member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearch = useCallback(
        (e) => {
            const searchTerm = e.target.value.toLowerCase();
            setSearchTermForAdmin(searchTerm);

            const filteredAdmins = completeAdmins.filter(
                (member) =>
                    member.name && member.name.toLowerCase().includes(searchTerm)
            );

            setAdmins(filteredAdmins);
        },
        [completeAdmins]
    );

    if (loading) return <CircularProgress />;
    if (error) return <p>{error}</p>;

    const handleOpenModal = (type) => {
        setInviteType(type);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <div className="px-4 pt-1">
            <h1 className="text-3xl font-bold mb-8">Team</h1>

            {/* Company Admins Section */}
            <div
                className="bg-[var(--secondary-color)]
       p-4 rounded-xl border border-[var(--para-color:)]  shadow-lg mb-12"
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Company Admins</h2>

                    <div className="flex items-center space-x-4">
                        <TextField
                            variant="outlined"
                            value={searchTermForAdmin}
                            onChange={handleSearch}
                            placeholder="Search admins"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FiSearch className="text-gray-500" />
                                    </InputAdornment>
                                ),
                            }}
                            className="max-w-xs w-full"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "2rem",
                                    height: "2rem",
                                },
                            }}
                        />

                        <button
                            className="font-medium text-[var(--primary-color)] whitespace-nowrap"
                            onClick={() => handleOpenModal("Admin")}
                        >
                            + Add Admins
                        </button>
                    </div>
                </div>

                <Grid container spacing={2}>
                    {admins.map(
                        (admin, index) =>
                            admin?.phoneNumber && (
                                <Grid
                                    key={admin._id || index}
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    lg={3}
                                >
                                    <TeamMembersCard setAnchorEl={setAnchorEl} anchorEl={anchorEl} admin={admin} onDelete={handleDelete} />
                                </Grid>
                            )
                    )}
                </Grid>
            </div>

            {/* Company Members Section */}
            <div className="bg-[var(--secondary-color)] p-4 rounded-xl border border-[var(--para-color:)] shadow-lg mb-12">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Company Members</h2>

                    <div className="flex items-center space-x-4">
                        <TextField
                            variant="outlined"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search members"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FiSearch className="text-gray-500" />
                                    </InputAdornment>
                                ),
                            }}
                            className="max-w-xs w-full"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "2rem",
                                    height: "2rem",
                                },
                            }}
                        />

                        <button
                            className="font-medium text-[var(--primary-color)] whitespace-nowrap"
                            onClick={() => handleOpenModal("Member")}
                        >
                            + Add Members
                        </button>
                    </div>
                </div>

                {/* Render filtered members */}

                {filteredMembers.length > 0 ? (
                    <Grid container spacing={2}>
                        {filteredMembers.map((member, index) => (
                            <Grid key={member._id || index} item xs={12} sm={6} md={4} lg={3}>
                                <TeamMembersCard setAnchorEl={setAnchorEl} anchorEl={anchorEl} admin={member} onDelete={handleDelete} />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography variant="body1" color="textSecondary">
                        No members found.
                    </Typography>
                )}
            </div>

            {/* Invite Team Modal */}
            <InviteTeamModal
                open={openModal}
                setOpenModal={setOpenModal}
                fetchTeamMembers={fetchTeamMembers}
                inviteType={inviteType}
                isorganizationId={isorganizationId}
            />
        </div>
    );
};

export default Teams;
