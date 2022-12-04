import Web3 from 'web3';
import { createContext, useContext, useEffect, useState, useMemo } from "react";

import DataTable from 'react-data-table-component';
import { Export } from 'react-data-table-component';

const Search = () => {

    const [activeTag, setActiveTag] = useState('PFP');
    const [data, setData ] = useState([]);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [cta, setCta] = useState('');
    const columns = [
        {
            name: 'Wallet Addresses',
            selector: row => row
        },
    ]

    const sendNotification = async() => {
        const data = {
            title,
            body,
            cta
        }
        const sendCall = await fetch(
            `https://wallet-ad-production.up.railway.app/v1/sendNotification`,
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data)
            }
        )

        const res = await sendCall.json();

        if(res.status) {
            alert('Notifications sent successfully!')
        }
    }

    function convertArrayOfObjectsToCSV(array) {
        	let result = '';
        
        	const columnDelimiter = ',';
        	const lineDelimiter = '\n';
            
            array.forEach(element => {
                result += element + lineDelimiter
            });
        
        	return result;
        }

    function downloadCSV(array) {
        	const link = document.createElement('a');

        	let csv = convertArrayOfObjectsToCSV(array)
        	if (csv == null) return;
        
        	const filename = 'export.csv';
        
        	if (!csv.match(/^data:text\/csv/i)) {
        		csv = `data:text/csv;charset=utf-8,${csv}`;
        	}
        
        	link.setAttribute('href', encodeURI(csv));
        	link.setAttribute('download', filename);
        	link.click();
    }

    const Export = ({ onExport }) => <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full' onClick={e => onExport(e.target.value)}>Export</button>;

    const actionsMemo = useMemo(() => <Export onExport={() => downloadCSV(data)} />, []);

    const getWallets = async() => {
        const fetchCall = await fetch(
            `https://wallet-ad-production.up.railway.app/v1/getHoldersByTag/${activeTag}`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );

        const res = await fetchCall.json();

        console.log(res);
        setData(res.holders);
    }

    return <div className="mt-[100px]">
        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-3">
                <div className="row p-2">
                    <div className="flex ml-4">
                    <button onClick={(e) => setActiveTag('PFP')} className={activeTag === 'PFP' ? "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                        : "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full opacity-50"}
                    >
                        PFP
                    </button>    
                    <button onClick={(e) => setActiveTag('land')} className={ activeTag === 'land' ? "ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                        : "ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full opacity-50"}
                    >
                        LAND
                    </button>  
                    <button onClick={(e) => setActiveTag('game')} className={activeTag === 'game' ? "ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                        : "ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full opacity-50"}
                    >
                        GAME
                    </button>    
                    <button onClick={(e) => setActiveTag('art')} className={ activeTag === 'art' ? "ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                        : "ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full opacity-50"}
                    >
                        ART
                    </button>       
                    </div>
                </div>
                <div className='row p-2 mt-4'>
                    <button onClick={getWallets} className='ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full'>
                        Seach for {activeTag.toUpperCase()}
                    </button>
                </div>
                {
                    data.length > 0 ? 
                        <div className='row mt-[100px]'>
                            Title
                            <input type="text" placeholder='Enter title' className='mt-2 mb-4 pl-2 ml-4 border border-blue-500 rounded-lg h-[50px] w-[300px]' 
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <br />
                            Body
                            <textarea type="text" placeholder='Body text goes here' className="mt-2 pl-2 ml-4 border border-blue-500 rounded-lg h-[300px] w-[300px]" 
                                onChange={(e) => setBody(e.target.value)}
                            />
                            <br />
                            CTA
                            <input type="text" placeholder='Enter CTA link' className='mt-2 mb-4 pl-2 ml-4 border border-blue-500 rounded-lg h-[50px] w-[300px]' 
                                onChange={(e) => setCta(e.target.value)}
                            />


                            <br />
                            <button className='ml-4 mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full' onClick={sendNotification}>Send notification</button>
                        </div>
                        
                        :null
                }
            </div>

            <div className="col-span-9">
                {
                    data.length > 0 ? <DataTable
                                        columns={columns}
                                        data={data}
                                        pagination
                                        actions={actionsMemo}
                                    /> : null
                }
            </div>
        </div>
    </div>
}

export default Search;