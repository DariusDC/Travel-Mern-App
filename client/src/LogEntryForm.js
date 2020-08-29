import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { createLogEntry } from "./Api";

const LogEntryForm = ({ location, onClose }) => {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      data.latitude = location.latitude;
      data.longitude = location.longitude;
      await createLogEntry(data);
      setLoading(false);
      onClose();
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="entryForm">
      {error ? <h3 className="error">{error}</h3> : null}
      <label htmlFor="password" required>
        Password
      </label>
      <input
        name="password"
        autoComplete="off"
        type="password"
        ref={register}
      />
      <label htmlFor="title" required>
        Title
      </label>
      <input name="title" autoComplete="off" ref={register} />
      <label htmlFor="rating">Rating</label>
      <input type="number" name="rating" ref={register} />
      <label htmlFor="comments">Comments</label>
      <textarea name="comments" rows={3} ref={register}></textarea>
      <label htmlFor="description">Description</label>
      <textarea name="description" rows={3} ref={register}></textarea>
      <label>Image</label>
      <input name="image" autoComplete="off" ref={register} />
      <label>Visit Date</label>
      <input name="visitDate" type="date" required ref={register} />
      <button disabled={loading}>
        {loading ? "Loading..." : "Create Travel Log"}
      </button>
    </form>
  );
};

export default LogEntryForm;
