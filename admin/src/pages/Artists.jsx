import React, { useState } from "react";

const Teams = () => {
  const [sections, setSections] = useState([
    { id: 1, images: [], members: [] },
    { id: 2, images: [], members: [] },
    { id: 3, images: [], members: [] },
    { id: 4, images: [], members: [] },
    { id: 5, images: [], members: [] },
  ]);
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (index) => {
    setActiveSection((prev) => (prev === index ? null : index));
  };

  const addNewSection = () => {
    setSections((prev) => [
      ...prev,
      { id: prev.length + 1, images: [], members: [] },
    ]);
  };

  const handleImageUpload = (sectionId, files) => {
    const newImages = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );

    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, images: [...section.images, ...newImages] }
          : section
      )
    );
  };

  const addTeamMember = (sectionId, memberName) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, members: [...section.members, memberName] }
          : section
      )
    );
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 p-4">
      {/* Add New Section Button */}
      <div className="flex justify-center mb-5">
        <button
          onClick={addNewSection}
          className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600"
        >
          + Add a Team Section
        </button>
      </div>

      {/* Team Sections */}
      {sections.map((section, index) => (
        <div
          key={section.id}
          className="w-full bg-white rounded-lg shadow-md mb-5 p-4 transition-all duration-500"
        >
          {/* Team Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">Team {section.id}</h2>
            <button
              onClick={() => toggleSection(index)}
              className={`text-blue-500 underline font-medium ${
                activeSection === index ? "font-bold" : ""
              }`}
            >
              {activeSection === index ? "Hide Section" : "Show Section"}
            </button>
          </div>

          {/* Expandable Section */}
          <div
            className={`transition-all duration-500 overflow-hidden ${
              activeSection === index ? "max-h-[800px] mt-4" : "max-h-0"
            }`}
          >
            {/* Image Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Upload Images for Team {section.id}
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageUpload(section.id, e.target.files)}
                className="mt-2"
              />
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-5 gap-4">
              {section.images.map((image, idx) => (
                <img
                  key={idx}
                  src={image}
                  alt={`Team ${section.id} - Image ${idx + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>

            {/* Add Team Member */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">
                Team Members for Team {section.id}
              </h3>
              <AddMemberForm
                onAddMember={(name) => addTeamMember(section.id, name)}
              />
              <ul className="list-disc pl-5 mt-2">
                {section.members.map((member, idx) => (
                  <li key={idx} className="text-sm font-medium text-gray-700">
                    {member}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const AddMemberForm = ({ onAddMember }) => {
  const [memberName, setMemberName] = useState("");

  const handleAddMember = (e) => {
    e.preventDefault();
    if (memberName.trim() !== "") {
      onAddMember(memberName.trim());
      setMemberName("");
    }
  };

  return (
    <form onSubmit={handleAddMember} className="flex items-center gap-2">
      <input
        type="text"
        value={memberName}
        onChange={(e) => setMemberName(e.target.value)}
        placeholder="Enter team member's name"
        className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none"
      />
      <button
        type="submit"
        className="px-3 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600"
      >
        Add Member
      </button>
    </form>
  );
};

export default Teams;
