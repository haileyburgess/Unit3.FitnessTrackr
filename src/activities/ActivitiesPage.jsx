import { act } from "react";
import useMutation from "../api/useMutation";
import useQuery from "../api/useQuery";
import { useAuth } from "../auth/AuthContext";

export default function ActivitiesPage() {
  //fetch activities from the API and provide a tag

  const {
    data: activities,
    loading,
    error,
  } = useQuery("/activities", "activities");

  const { token } = useAuth();

  //mutation to POST to /activities and invalidate the "activities" tag to force a refetch from the API
  //renaming variables as in demo so as to not conflict w/ query variables
  const {
    mutate,
    data: addedActivity,
    loading: adding,
    error: addError,
  } = useMutation("POST", "/activities", ["activities"], {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  //deleting
  const {
    mutate: deletedActivity,
    deleting,
    deleteError,
  } = useMutation("DELETE", "/activities/", ["activities"], {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  // Function to handle deleting an activity
const handleDelete = (id) => {
  deletedActivity(null, `/activities/${id}`); // Dynamically add the id to the URL
};

  //call mutate function w/ data from the form (below)
  const addActivity = (formData) => {
    const name = formData.get("name");
    const description = formData.get("description");
    mutate({ name, description });
  };
  console.log(activities);
  return (
    <>
      <h1>Activities</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error loading activities: {error.message}</p>}
      {activities?.length > 0 ? (
        activities.map((activity) => (
          <p key={activity.id}>
          {activity.name}
          {token ? (
            <button onClick={() => deletedActivity(activity.id)} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </button>
          ) : null}
        </p>
        ))
      ) : (
        <p>No activities found.</p>
      )}
      <form action={addActivity}>
        <label>
          Name: <input type="text" name="name" />
          Description: <input type="text" name="description" />
        </label>
        <br />
        <button type="Submit">Submit</button>
      </form>
    </>
  );
}
