import {useState , useEffect} from 'react'
import {FaSearch} from 'react-icons/fa'
import { Link , useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'


export default function Header() {

    const {currentUser} = useSelector((state) => state.user)
    const [searchTerm, setSearchTerm] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className='bg-slate-200 shadow-md'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
            <Link to='/' >
            <h1 className='text-xl font-bold sm:text-2xl flex flex-wrap'>
                <span className='text-slate-500'>R.P. </span>
                <span className='text-slate-700'>Estate</span>
            </h1>
            </Link>
            <form onSubmit={handleSubmit}  className='bg-slate-100 p-3 rounded-lg flex items-center'>
                <input type="text" className='bg-transparent focus:outline-none w-24 sm:w-64'
                placeholder='Search...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button>
                    <FaSearch className='text-slate-600'/>
                </button>
            </form>
            <ul className='flex items-center gap-4 '>
                <Link to={'/'}><li className='hidden sm:inline text-slate-700 hover:underline '>Home</li></Link>
                <Link to={'/about'}><li className='hidden sm:inline text-slate-700 hover:underline'>About</li></Link>
                <Link to={'/profile'}>
                    {currentUser ? (<img
                        src={currentUser?.avatar || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                        alt="user"
                        className="w-10 h-10 rounded-full object-cover"
                        />) : 
                    (<li className='text-slate-700 hover:underline'>Sign In</li>) }
                </Link>
            </ul>
        </div>

    </header>
    
  )
}
