import axios from "axios";
import PackageCard from "../components/PackageCard";
import { Agent } from "node:https";

// تعريف نوع الباقة
interface Package {
  title: string;
  price: number;
  description: string;
}

// تعريف نوع رد GraphQL
interface GraphQLResponse {
  data: {
    TourismPackageCollection: Package[];
  };
}

// دالة لجلب البيانات من DotCMS
async function fetchPackages(): Promise<Package[]> {
  const query = `
    query ContentAPI {
      TourismPackageCollection {
        title
        price
        description
      }
    }
  `;
  const response = await axios.post(
    process.env.DOTCMS_API_URL as string,
    { query },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DOTCMS_API_TOKEN}`,
      },
      httpsAgent: new Agent({ rejectUnauthorized: false }),
    }
  );

  if (response.status !== 200) {
    throw new Error(`Failed to fetch packages: ${response.statusText}`);
  }

  const result: GraphQLResponse = response.data;
  if (!result.data?.TourismPackageCollection) {
    throw new Error("No packages found in response");
  }

  return result.data.TourismPackageCollection.map((item) => ({
    title: item.title,
    price: Number(item.price),
    description: item.description,
  }));
}

// الصفحة الرئيسية كـ Server Component
export default async function Home() {
  const packages = await fetchPackages();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold text-center mb-10">
        اختر باقتك السياحية
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {packages.map((pkg, index) => (
          <PackageCard
            key={`package-${pkg.title}-${index}`}
            title={pkg.title}
            price={pkg.price}
            description={pkg.description}
          />
        ))}
      </div>
      {/* إضافة محتوى الصفحة الرئيسية الأصلية */}
      <div className="mt-10 p-4 bg-base-200 rounded-lg text-center">
        <h2 className="text-3xl font-bold mb-4">مرحبًا بكم في بوابة السياحة</h2>
        <p className="text-lg mb-4">
          هنا يمكنك استعراض الحجوزات وإدارتها بسهولة وسرعة.
        </p>
        <a href="/bookings" className="btn btn-primary">
          استعرض الحجوزات الآن
        </a>
      </div>
    </div>
  );
}
