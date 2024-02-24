import React, { useState } from 'react';
import { ContentState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import moment from 'moment';


const Write = () => {

    const state = useLocation ().state;


    const [formData, setFormData] = useState({
        title: state?.title || '',
        cat: state?.cat ||'',
        file: null,
        value: state?.value ||'',
        desc: state?.desc || ''
    });
    
    const initialContent = state?.desc || 'Start writing here...';
    const _contentState = ContentState.createFromText(initialContent);
    const raw = convertToRaw(_contentState);  // RawDraftContentState JSON
    const [contentState, setContentState] = useState(raw); // ContentState JSON



    const onEditorStateChange = (contentState) => {
        setContentState(contentState);
        const currentText = contentState.blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');
        setFormData({
            ...formData,
            desc: currentText
        });
    };


    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            file: e.target.files[0]
        });
    };

    const upload = async (file) => {
        const data = new FormData();
        data.append('file', file);
        const res = await axios.post('/upload', data);
        console.log(res);
        return res.data;
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        const imgURL = await upload(formData.file);

        //implement the put and post methods for the update and create

        if (state) {
            try {
                await axios.put(`/posts/${state.id}`, {
                    title: formData.title,
                    desc: formData.desc,
                    cat: formData.cat,
                    img: imgURL,
                });
            }
            catch (err) {}
        }
        else {
            try {
                   await axios.post('/posts/', {
                    title: formData.title,
                    desc: formData.desc,
                    cat: formData.cat,
                    img: imgURL,
                    date: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                    
                });
                
            }
            catch (err) {}
        }
    }

    return (
        <div className="add">
            <div className="content">
                <input type="text" value={formData.title} placeholder="Title" name="title" onChange={handleInputChange} />
                <div className="editor">
                    <Editor defaultContentState={contentState}
                    onContentStateChange={onEditorStateChange} 
                    wrapperClassName="wrapper-class"
                    editorClassName="editor-class"
                    toolbarClassName="toolbar-class"
                    />
                </div>
            </div>
            <div className="options">
                <div className="option1">
                    <h1>Publish</h1>
                    <span>
                        <b>Status:</b> Draft
                    </span>
                    <input style={{display: "button"}} type="file" id="file" name="file" onChange={handleFileChange} />
                    <button onClick={() => console.log("Save as Draft")}>Save as Draft</button>
                    <button onClick={handleSubmit}>Update</button>
                </div>
                <div className="option2">
                    <h1>Categories</h1>
                    <div className="catButtons">
                    <input type="radio" name="cat" value="sports" id="sports" onChange={handleInputChange} checked={formData.cat === 'sports'} />
                    <label htmlFor="sports">Sports</label>
                    <input type="radio" name="cat" value="fitness" id="fitness" onChange={handleInputChange} checked={formData.cat === 'fitness'} />
                    <label htmlFor="fitness">Fitness</label>
                    <input type="radio" name="cat" value="fashion" id="fashion" onChange={handleInputChange} checked={formData.cat === 'fashion'} />
                    <label htmlFor="fashion">Fashion</label>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Write