import React, { useState, useRef } from 'react';
import "./Uploader.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { hideDialog, showDialog } from "../../store/dialogView";

const Uploader: React.FC = () => {
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useDispatch();

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        const formData = new FormData();
        if (selectedFile) {
            setLoading(true);
            formData.append('file', selectedFile);
            axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((data) => {
                if (data) {
                    setFileName(selectedFile.name);
                    dispatch(showDialog());
                    setLoading(false);
                }
            })
            .catch((error) => {
                alert(error.response?.data);
                dispatch(hideDialog())
                setLoading(false);
            });

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };
    const resetOnClick = () => {
        setFileName(null);
    }

    return (
        <div className="container">
            <div className="card">
                <h3>Upload Files</h3>
                <div className="drop_box">
                    {!fileName && !loading ? (
                        <div>
                            <header>
                                <h4>Select File here</h4>
                            </header>
                            <p>PDF or plain text files are supported</p>
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept=".txt,.pdf"
                                hidden
                                onChange={handleFileChange}
                            />
                            <button className="btn" onClick={handleButtonClick}>Choose File</button>
                        </div>
                    ) : !loading ? (
                        <div className='form'>
                            <header className="header-uploaded">
                                <h4>{`File ${fileName} uploaded successfully!`}</h4>
                            </header>
                            <div className='btn-center'>
                                <button className="btn" onClick={resetOnClick}>OK</button>
                            </div>
                        </div>
                    ) : <div className='form loading'>
                            <header className="">
                                <h4>Loading...</h4>
                            </header>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default Uploader;
