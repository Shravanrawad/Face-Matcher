import { useState } from "react";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { RiArrowUpDownFill } from "react-icons/ri";
import axios from "axios";

export default function App() {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImage1Change = (e) => {
    const file = e.target.files[0];
    if (file) setImage1(file);
  };

  const handleImage2Change = (e) => {
    const file = e.target.files[0];
    if (file) setImage2(file);
  };

  const compareFaces = async () => {
    if (!image1 || !image2) {
      alert("Please upload both images.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("api_key", "8NfuD7LF1U4KTBak0xDuk_clQZTDL0eD");
    formData.append("api_secret", "UuvGfLS6v3WA8AZUuH_8JWuWRU8KyVH8");
    formData.append("image_file1", image1);
    formData.append("image_file2", image2);

    try {
      const response = await axios.post(
        "https://api-us.faceplusplus.com/facepp/v3/compare",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const { confidence, faces1, faces2 } = response.data;

      const facesDetails = {
        image1: faces1.map((face, index) => ({
          faceNumber: index + 1,
          height: face.face_rectangle.height,
          width: face.face_rectangle.width,
          top: face.face_rectangle.top,
          left: face.face_rectangle.left,
        })),
        image2: faces2.map((face, index) => ({
          faceNumber: index + 1,
          height: face.face_rectangle.height,
          width: face.face_rectangle.width,
          top: face.face_rectangle.top,
          left: face.face_rectangle.left,
        })),
      };

      setComparisonResult({
        confidence,
        facesDetails,
      });
    } catch (error) {
      console.error("Error comparing faces:", error);
      setComparisonResult({ error: "An error occurred while comparing faces." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col mb-5 items-center justify-center bg-gray-50 p-4">
      <h1 className="text-3xl font-bold text-blue-500 mb-6">Face Matcher</h1>

      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 items-center gap-6">
        <div className="flex flex-col items-center">
          <div className="w-64 h-64 bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg overflow-hidden">
            {image1 ? (
              <img
                src={URL.createObjectURL(image1)}
                alt="Uploaded 1"
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-gray-500">Image 1 Preview</span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImage1Change}
            className="mt-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
          />
        </div>

        <div className="flex justify-center items-center text-4xl text-gray-500">
          <FaArrowRightArrowLeft className="hidden sm:block" />
          <RiArrowUpDownFill className="sm:hidden block" />
        </div>

        <div className="flex flex-col items-center">
          <div className="w-64 h-64 bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg overflow-hidden">
            {image2 ? (
              <img
                src={URL.createObjectURL(image2)}
                alt="Uploaded 2"
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-gray-500">Image 2 Preview</span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImage2Change}
            className="mt-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
          />
        </div>
      </div>

      <button
        onClick={compareFaces}
        className="mt-6 py-3 px-6 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600"
        disabled={loading}
      >
        {loading ? "Matching..." : "Match Faces"}
      </button>

      {comparisonResult && (
        <div className="mt-6 w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
          {comparisonResult.error ? (
            <p className="text-red-500 font-bold">{comparisonResult.error}</p>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-green-500">
                The faces are {comparisonResult.confidence}% similar
              </h2>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-600">Image 1 Details:</h3>
                <ul className="list-disc ml-5 text-gray-700">
                  {comparisonResult.facesDetails.image1.map((face) => (
                    <li key={face.faceNumber}>
                      Face {face.faceNumber}: Height - {face.height}, Width -{" "}
                      {face.width}, Top - {face.top}, Left - {face.left}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-600">Image 2 Details:</h3>
                <ul className="list-disc ml-5 text-gray-700">
                  {comparisonResult.facesDetails.image2.map((face) => (
                    <li key={face.faceNumber}>
                      Face {face.faceNumber}: Height - {face.height}, Width -{" "}
                      {face.width}, Top - {face.top}, Left - {face.left}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
