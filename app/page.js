import { redirect } from 'next/navigation';

export default function Home() {
  // Send visitors from / to /founder-led automatically
  redirect('/founder-led');
}
