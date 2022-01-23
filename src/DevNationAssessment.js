import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DevnationAssessment.css';
import { WithContext as ReactTags } from 'react-tag-input';
import $ from 'jquery';
function DevNationAssessment() {
    const [students, setStudents] = useState([]);
    const [studentsFilter, setStudentsFilter] = useState([]);
    const [expand, setExpand] = useState(false);
    useEffect(() => {
        axios.get('https://api.hatchways.io/assessment/students')
            .then((response) => {
                // console.log(response);
                let gr;

                response.data.students.map((st) => {
                    gr = 0;
                    st.grades.map((g) => {
                        gr = gr + parseInt(g);
                    })
                    st.average = (gr / 800) * 100;
                    st.tags = [];
                    st.expand = false
                })
                console.log(response.data.students)
                setStudents(response.data.students);
                setStudentsFilter(response.data.students);
            })
    }, [])

    // useEffect(()=>{

    // },[])

    function nameFilter(evt) {
        let value = evt.target.value.toLowerCase();
        let result = studentsFilter.filter((user) => {
            let fullname = user.firstName + ' ' + user.lastName;
            return fullname.toLowerCase().search(value) != -1;
        });
        setStudents(result);
    }

    const tagFilter = (evt) => {
        let value = evt.target.value.toLowerCase();
        let result = studentsFilter.filter((v) => {

            let t = v.tags.filter((tag) => {
                return tag.text.toLowerCase().search(value) != -1;
            });
            if (t.length > 0) {
                return true;
            }
            if(value == ''){
                return true
            }


        })
        setStudents(result);
    }

    const handleDelete = i => {
        let newArray = [...students];
        newArray[0] = { ...newArray[0], tags: newArray[0].tags.filter((tag, index) => index !== i) };
        console.log(newArray);
        setStudents(newArray);
        setStudentsFilter(newArray);
    };

    const handleAddition = (tag, index) => {
        let newArray = [...students];
        newArray[index] = { ...newArray[index], tags: [...newArray[index].tags, tag] };
        setStudents(newArray);
        setStudentsFilter(newArray);
    };

    const handleTagClick = index => {
        console.log('The tag at index ' + index + ' was clicked');
    };
    const KeyCodes = {
        enter: 13
    };

    const delimiters = [KeyCodes.enter];
    return (
        <React.Fragment>
            <div className='main py-5 w-100' style={{ 'background': '#eaeaea' }}>
                <div className='container'>
                    <div className='list' style={{ 'background': '#fff' }}>
                        <div className='form-group mb-0'>
                            <input type="text" className='form-control' onChange={nameFilter} placeholder='Search by name' />
                        </div>
                        <div className='form-group'>
                            <input type="text" className='form-control' onChange={tagFilter} placeholder='Search by tag' />
                        </div>
                        {students.map((student, index) => {
                            return (
                                <div className='row border-bottom py-2 item' key={index}>
                                    <div className='col-sm-2 text-center'>
                                        <div>
                                            <img className='student-img' src={student.pic} alt="" />
                                        </div>
                                    </div>
                                    <div className='col-sm-8'>
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <h3>{student.firstName} {student.lastName}</h3>
                                            {!student.expand ?
                                            <button className='btn btn-light' onClick={(evt) => {
                                                // evt.target.parentElement.parentElement.parentElement.style.height = "400px";
                                                let newArray = [...students];
                                                setStudents([...students , newArray[index].expand = true]);
                                            }}><span className='fas fa-plus'></span></button>
                                            :
                                            <button className='btn btn-light' onClick={(evt) => {
                                                // evt.target.parentElement.parentElement.parentElement.style.height = "184px";
                                                let newArray = [...students];
                                                setStudents([...students , newArray[index].expand = false]);
                                            }}><span className='fas fa-minus'></span></button>
                                            }
                                        </div>
                                        <p>Email: {student.email}</p>
                                        <p>Company: {student.company}</p>
                                        <p>Skill: {student.skill}</p>
                                        <p>Average: {student.average}</p>

                                        <ReactTags
                                            tags={student.tags}
                                            // suggestions={suggestions}
                                            autofocus={false}
                                            placeholder='Add New Tag'
                                            delimiters={delimiters}
                                            handleDelete={handleDelete}
                                            handleAddition={(tag) => handleAddition(tag, index)}
                                            handleTagClick={handleTagClick}
                                            inputFieldPosition="bottom"
                                            autocomplete
                                        />

                                        {student.expand && student.grades.map((grade, gi) => {
                                            return (
                                                <p>Test{gi + 1}: {grade}%</p>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export { DevNationAssessment }
