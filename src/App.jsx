import { useState, useEffect } from 'react'
import { Button, Switch } from 'antd';
import './App.css'
import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';

function App() {
  const [status, setStatus] = useState(false);
  const [sites, setSites] = useState([]);

  async function start() {
    setStatus(true);
    chrome.storage.sync.set({ isExtOn: true });
  }

  async function stop() {
    setStatus(false);
    chrome.storage.sync.set({ isExtOn: false });
  }

  async function addSite() {
    let site = prompt('Enter the url of the site want to block:')
    let newSites = [...sites, site];
    setSites(newSites);
    chrome.storage.sync.set({ blockedSites: newSites }); 
  }

  async function delSite(name) {
    let deleteSite = sites.filter(site => (site !== name));
    setSites(deleteSite);
    chrome.storage.sync.set({ blockedSites: deleteSite });
  }

  useEffect(() => {
    async function fetchStatus() {
      const stat = await chrome.storage.sync.get();
      setStatus(stat.isExtOn)
      setSites(stat.blockedSites)
    }
    fetchStatus()
  }, [])
  return (
    <div className='app_container'>
      <div className='header'>
        <img src='/logo.png' />
        {
          status ? (
            <button onClick={() => { stop() }} className='btn-on'>
              ON
            </button>
          ) : (
            <button onClick={() => { start() }} className='btn-off'>
              OFF
            </button>
          )
        }
        
      </div>
      
      <div className='sites_list'>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: 5 }}>Blocked sites: <span onClick={() => { addSite() }}><PlusCircleOutlined /></span></h2>
        {
          sites.map(site => (
            <div className='site'>
              <div className='site_left'>
                <img height="20" width="20" src={`https://icons.duckduckgo.com/ip3/www.${site}.ico`}/>
                <span>{site}</span>
              </div>
              
              <div className='site_right'>
                {/* <Switch size="small" defaultChecked onChange={onChange} /> */}
                <Button onClick={() => { delSite(site) }} className='del-btn' danger icon={<DeleteOutlined style={{ color: '#BC4749' }} />} defaultBg="#fffff10" defaultBorderColor="#BC4749"></Button>
              </div>
              
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default App
