import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import camera from "../assets/camera.png";
import Posts from "./posts";
import NewPost from "./newPost";
import API_URL from "../config";
import { ProfileProps, ProfileFormInputs} from "../types";
import { User } from "../interfaces";

const Profile: React.FC<ProfileProps> = ({ isVisitor, setIsVisitor }) => {
  const { register, handleSubmit } = useForm<ProfileFormInputs>();
  const [username, setUsername] = useState<string>("");
  const [image, setImage] = useState<string>("");

  const [modalVisibility, setModalVisibility] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/users/profile`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          navigate("/login");
          throw new Error("User is not logged in, redirected to login page");
        }
        return response.json();
      })
      .then((data) => {
        if (data.user.isVisitor) {
          setIsVisitor(true);
          setUsername("visitor");
          setImage(data.user.profile_image);
        } else {
          setIsVisitor(false);
          setUsername(data.user.username);
          setImage(data.user.profile_image);
          setUser(data.user);
          console.log(data.user);
        }
      })

      .catch((error) => {
        console.error("Error fetching profile data:", error);
        navigate("/login");
      });
  }, [navigate, setIsVisitor]);

  const showModal = () => setModalVisibility(true);
  const hideModal = () => setModalVisibility(false);

  const onSubmit = async (data: ProfileFormInputs) => {
    const file = data.image[0];

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `${API_URL}/users/update-profile-picture`,
        {
          method: "PUT",
          body: formData,
          credentials: "include",
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      const uploadData = await response.json();
      hideModal();
      setImage(uploadData.profile_image);
      window.location.reload();
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 text-left shadow-md p-4">
      <div className="flex gap-3">
        <img
          src={image}
          className="rounded-full w-16 h-16 sm:w-20 sm:h-20"
          alt="profile"
        />

        <NewPost isVisitor={isVisitor}  />
      </div>

      <div className="flex flex-col sm:flex-row items-center  sm:gap-6 mt-6">
        <div className="relative w-28 h-28 sm:w-36 sm:h-36">
          <img
            src={image}
            className="outline outline-offset-2 outline-gray-500 rounded-full w-full h-full"
          />
          <img
            src={camera}
            alt="camera"
            onClick={showModal}
            className="absolute bottom-2 right-2 w-10 h-10 cursor-pointer bg-base-100 rounded-full p-1"
          />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold mt-4 sm:mt-8">
          {username}
        </h2>
      </div>

      {modalVisibility && (
        <div id="profileModal" className="pt-6 w-fit">
          <form
            id="UpdateProfilePicture"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col"
            method="POST"
            encType="multipart/form-data"
            action=""
          >
            <div className="flex flex-row gap-4">
              <label htmlFor="profilePicture">
                Choose a new profile picture:
              </label>
              <input
                type="file"
                {...register("image")}
                id="profilePicture"
                name="file"
                accept="image/png, image/jpeg"
                required
              />
            </div>

            <div className="flex flex-row gap-2">
              <button
                type="button"
                className="mt-6 bg-red-500 hover:bg-indigo-600 text-white font-bold mb-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={hideModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="mt-6 bg-blue-500 hover:bg-indigo-600 text-white font-bold mb-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      )}

      {user && (
        <Posts userId={user.id} loggedInUserId={user.id} />
      )}
    </div>
  );
}

export default Profile;