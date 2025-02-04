import React, { useState } from "react";
import { useForm } from "react-hook-form";
import backgroundImage from "../../assets/bgImage.jpg";
import Avater from "../../assets/doctor_Logo.png";
import { MdImage } from "react-icons/md";
import { specialization } from "../../constants";
import { LuCamera } from "react-icons/lu";
import { baseUrl } from "../../constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Patient_Registration = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const createNotification = (type) => {
    return () => {
      NotificationManager.info(type);
    };
  };

  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [image, setImage] = useState(Avater);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e.target.result;
        setImage(base64Image);
        uploadToImgbb(base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadToImgbb = async (base64Image) => {
    try {
      const formData = new FormData();
      formData.append("image", base64Image.split(",")[1]); // Remove the data:image/png;base64, part
      const response = await axios.post(
        "https://api.imgbb.com/1/upload",
        formData,
        {
          params: {
            key: "ed67a942812ea90bf6e8f65a6c43c091",
          },
        }
      );
      if (response.status == 200) {
        alert("Image Uploaded");
        console.log(response.data.data.url);
        setValue("profile_img", response.data.data.url);
      } else {
        alert("Couldn't upload the image properly");
      }
    } catch (error) {
      console.error("Error uploading image to imgbb", error);
    }
  };

  const onSubmit = (data) => {
    if (!("profile_img" in data)) {
      if (image !== Avater) {
        alert("Image not uploaded yet, Please wait...");
        return;
      }
      alert("Please upload your Profile Image");
      return;
    }
    
    if (data["password1"].length < 6) {
      alert("Password length can't be less than 6");
      return;
    }

    if (data["password1"] !== data["password2"]) {
      alert("The passwords do not match");
      return;
    }

    if (data["available_days"].length == 0) {
      alert("Please check the available days");
      return;
    }

    data["available_days"] = data["available_days"].join("");

    console.log(data);
    console.log(typeof data);

    fetch(`${baseUrl}/doctors/registration/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.ok) {
          // console.log(res.text());
          return res.text();
        }
        return null;
      })
      .then((data) => {
        if (data == null) {
          alert("Can't create an account with this email");
          return;
        }
        navigate("/doctor-login");
        console.log(data);
      });
  };

  return (
    <div
      style={{ backgroundImage: `url(${backgroundImage})` }}
      className="interfont flex flex-col items-center justify-center h-screen bg-cover"
    >
      <h1 className="text-3xl font-semibold text-[#53829C] text-center mb-4">
        Doctor Registration
      </h1>
      <div className="overflow-y-scroll custom-scrollbar  flex flex-col items-center rounded-md border border-[#c5d8e2] shadow-2xl  bg-opacity-85 backdrop-filter backdrop-blur-xl space-y-4 p-8">
        {/* Profile Image */}

        <div className="object-cover relative flex  items-end justify-center space-y-2">
          <img
            className=" object-cover w-[4.5rem] h-[4.5rem] rounded-full ring-2 ring-[#53829C] cursor-pointer"
            src={image}
            alt="Avatar"
          />
          <div className="absolute bottom-0 right-0">
            <div className="relative z-10">
              <label htmlFor="fileInput" className="cursor-pointer">
                <div className="p-1 bg-[#53829C] rounded-full">
                  <LuCamera size={20} className=" text-white" />
                </div>
              </label>
              <input
                type="file"
                accept="image/*"
                id="fileInput"
                className="opacity-0 hidden absolute top-0 left-0 w-full h-full cursor-pointer"
                onChange={handleImageChange}
              />
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="w-full">
          <form className="space-y-4 w-full" onSubmit={handleSubmit(onSubmit)}>
            {/* Name */}
            <div className="relative z-0">
              <input
                type="text"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                {...register("name", { required: true })}
              />
              <label
                htmlFor="floating_standard"
                className="absolute text-sm text-black dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Name
              </label>
            </div>

            {/* Email + Number*/}

            <div className="relative flex z-0">
              <input
                type="email"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                {...register("email", {
                  required: true,
                  pattern: /^\S+@\S+$/i, // Basic email validation
                })}
              />
              <label
                htmlFor="floating_standard"
                className="absolute text-sm text-black dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Email
              </label>
            </div>

            {/* Password */}
            <div className="relative z-0">
              <input
                type="password"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                {...register("password1", { required: true })}
              />
              <label
                htmlFor="floating_standard"
                className="absolute text-sm text-black dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Password
              </label>
            </div>
            <div className="relative z-0">
              <input
                type="password"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                {...register("password2", { required: true })}
              />
              <label
                htmlFor="floating_standard"
                className="absolute text-sm text-black dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Re-type Password
              </label>
            </div>
            {/* Specialization */}
            <div>
              <label htmlFor="specialization" className="sr-only">
                Specialization
              </label>
              <select
                id="specialization"
                className="block py-2 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                {...register("specialization", { required: true })}
              >
                <option value="">Select specialization</option>
                {specialization.map((item, index) => (
                  <option key={index} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            {/* From Time */}
            <div className="w-full flex items-center justify-between space-x-3 p-1">
              <label className="text-slate-600" htmlFor="">
                Available Time :
              </label>
              <div className="relative z-0">
                <input
                  type="time"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  {...register("from_time", { required: true })}
                />
                <label
                  htmlFor="floating_standard"
                  className="absolute text-sm text-black dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  From Time
                </label>
              </div>

              {/* To Time */}
              <div className="relative z-0">
                <input
                  type="time"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  {...register("to_time", { required: true })}
                />
                <label
                  htmlFor="floating_standard"
                  className="absolute text-sm text-black dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  To Time
                </label>
              </div>
            </div>
            {/* Available Days */}
            <div className=" ">
              <label className="text-black" htmlFor="">
                Available Days
              </label>
              <div className="flex flex-col text-sm bg-transparent border-2 p-3 sidebar  ">
                <div className="flex mt-1 space-x-3">
                  <div className="flex space-x-3">
                    <input
                      type="checkbox"
                      id="saturday"
                      name="available_days"
                      value="6"
                      {...register("available_days")}
                    />
                    <label
                      id="saturday"
                      className="cursor-pointer"
                      htmlFor="saturday"
                    >
                      Saturday
                    </label>
                  </div>
                  <div className="flex space-x-3">
                    <input
                      type="checkbox"
                      id="sunday"
                      name="available_days"
                      value="0"
                      {...register("available_days")}
                    />
                    <label
                      id="sunday"
                      className="cursor-pointer"
                      htmlFor="sunday"
                    >
                      Sunday
                    </label>
                  </div>
                  <div className="flex space-x-3">
                    <input
                      type="checkbox"
                      id="monday"
                      name="available_days"
                      value="1"
                      {...register("available_days")}
                    />
                    <label
                      id="monday"
                      className="cursor-pointer"
                      htmlFor="monday"
                    >
                      Monday
                    </label>
                  </div>
                </div>
                <div className="flex mt-1 space-x-3">
                  <div className="flex space-x-3">
                    <input
                      type="checkbox"
                      id="tuesday"
                      name="available_days"
                      value="2"
                      {...register("available_days")}
                    />
                    <label
                      id="tuesday"
                      className="cursor-pointer"
                      htmlFor="tuesday"
                    >
                      Tuesday
                    </label>
                  </div>
                  <div className="flex space-x-3">
                    <input
                      type="checkbox"
                      id="wednesday"
                      name="available_days"
                      value="3"
                      {...register("available_days")}
                    />
                    <label
                      id="wednesday"
                      className="cursor-pointer"
                      htmlFor="wednesday"
                    >
                      Wednesday
                    </label>
                  </div>
                  <div className="flex space-x-3">
                    <input
                      type="checkbox"
                      id="Thursday"
                      name="available_days"
                      value="4"
                      {...register("available_days")}
                    />
                    <label
                      id="Thursday"
                      className="cursor-pointer"
                      htmlFor="Thursday"
                    >
                      Thursday
                    </label>
                  </div>
                </div>
                <div className="flex space-x-3 mt-1">
                  <input
                    type="checkbox"
                    id="Friday"
                    name="available_days"
                    value="5"
                    {...register("available_days")}
                  />
                  <label
                    id="Friday"
                    className="cursor-pointer"
                    htmlFor="Friday"
                  >
                    Friday
                  </label>
                </div>
              </div>
            </div>

            {/* description */}
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-black"
              >
                Description
              </label>
              <textarea
                id="notes"
                className="outline-none p-3 w-full mt-1 text-sm bg-transparent border-[#53829C] border rounded-md  focus:border-blue-600 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:text-gray-400 dark:border-gray-700 dark:bg-transparent"
                rows={4}
                placeholder="Write something about you ..."
                {...register("description")}
              />
            </div>
            {/* Submit */}
            <div className="">
              <input
                className="bg-[#53829C] mt-4 hover:bg-[#497791] rounded-md w-full px-2 py-1 cursor-pointer hover:scale-105 duration-300 text-md font-semibold text-white"
                disabled={isSubmitting}
                type="submit"
                value="Register"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Patient_Registration;
