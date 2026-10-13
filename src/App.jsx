import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function App() {
  const [plants, setPlants] = useState([]);
  const [plantName, setPlantName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlants();
  }, []);

  async function fetchPlants() {
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch error:', error.message);
    } else {
      setPlants(data || []);
    }
  }

  async function addPlant(e) {
    e.preventDefault();
    if (!plantName.trim()) return;

    setLoading(true);

    const { data, error } = await supabase
      .from('plants')
      .insert([{ name: plantName }])
      .select();

    setLoading(false);

    if (error) {
      alert('Error: ' + error.message);
    } else if (data) {
      setPlants([data[0], ...plants]);
      setPlantName('');
    }
  }

  return (
    <div style={{ maxWidth: 450, margin: '50px auto', fontFamily: 'sans-serif', padding: 20 }}>
      <h2>🌱 Plant Tracker</h2>
      <form onSubmit={addPlant} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="e.g. Tulsi"
          value={plantName}
          onChange={(e) => setPlantName(e.target.value)}
          style={{ flex: 1, padding: 10, borderRadius: 6, border: '1px solid #ccc' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ padding: '10px 16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
        >
          {loading ? 'Adding...' : 'Add Plant'}
        </button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {plants.map((item) => (
          <li key={item.id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
            🌿 {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}