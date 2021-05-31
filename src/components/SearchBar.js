import React, { useState } from 'react';
import { Input, Radio } from 'antd';

import {SEARCH_KEY} from '../constants';

const { Search } = Input;//Search在Input下面

function SearchBar(props) {

    const [searchType, setSearchType] = useState(SEARCH_KEY.all);//默认选择all
    const [error, setError] = useState("");

    const changeSearchType = e => {
        const searchType = e.target.value;
        setSearchType(searchType);
        setError("")
        // searchType === all
        if (searchType === SEARCH_KEY.all) {
            props.handleSearch({type: searchType, keyword:""});
        }
    }
    const handleSearch = value => {//value是search输入框的输入
        //case 1: display error
        if (searchType !== SEARCH_KEY.all && value === "") {
            //设置error信息
            setError("Please input your search keyword");
            return;
        }
        //case 2: clear error
        setError("");
        // searchType === keyword/user && value !== ""
        props.handleSearch({type: searchType, keyword: value});
    }
    return (
        <div className="search-bar">
            <Search
                placeholder="input search text"
                enterButton="Search"
                allowClear
                size="large"
                onSearch={handleSearch}
                disabled={searchType===SEARCH_KEY.all}
            />
            <p className="error-msg">{error}</p>
            <Radio.Group
                onChange={changeSearchType}
                value={searchType}
                className="search-type-group"
            >
                <Radio value={SEARCH_KEY.all}>All</Radio>
                <Radio value={SEARCH_KEY.keyword}>Kewword</Radio>
                <Radio value={SEARCH_KEY.user}>User</Radio>
            </Radio.Group>
            
        </div>
    );
}

export default SearchBar;