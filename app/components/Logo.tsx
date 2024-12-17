import { useRouter } from 'next/navigation';

export function Logo() {
    const router = useRouter();

    return (
        <div
            className="p-4  cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => router.push('/')}
        >
            <div className="flex items-center">
                <div className="text-blue-500 font-bold text-2xl">JX</div>
                <div className="text-gray-100 font-bold text-2xl">GPT</div>
            </div>
        </div>
    );
}