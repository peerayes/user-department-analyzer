import { TransformedData, User } from "@/types/user.types";

export const transformUserData = (users: User[]): TransformedData => {
  // ใช้ Map เพื่อประสิทธิภาพในการรวบรวมข้อมูล
  const departmentMap = new Map<
    string,
    {
      males: User[];
      females: User[];
      ages: number[];
      hairColors: Map<string, number>;
      addresses: Map<string, string>;
    }
  >();

  // วนลูปข้อมูลผู้ใช้เพียงครั้งเดียว
  for (const user of users) {
    if (!user.company?.department) continue;

    const department = user.company.department;
    const isMale = user.gender.toLowerCase() === "male";
    const fullName = `${user.firstName}${user.lastName}`;
    const hairColor = user.hair.color;
    const postalCode = user.address.postalCode;

    // ถ้ายังไม่มีข้อมูลของแผนกนี้ ให้สร้างใหม่
    if (!departmentMap.has(department)) {
      departmentMap.set(department, {
        males: [],
        females: [],
        ages: [],
        hairColors: new Map<string, number>(),
        addresses: new Map<string, string>(),
      });
    }

    const deptData = departmentMap.get(department)!;

    // แยกข้อมูลตามเพศ
    if (isMale) {
      deptData.males.push(user);
    } else {
      deptData.females.push(user);
    }

    // เก็บข้อมูลอายุ
    deptData.ages.push(user.age);

    // นับสีผม
    const currentHairCount = deptData.hairColors.get(hairColor) || 0;
    deptData.hairColors.set(hairColor, currentHairCount + 1);

    // เก็บที่อยู่
    deptData.addresses.set(fullName, postalCode);
  }

  // แปลง Map เป็น Object ตามรูปแบบที่ต้องการ
  const result: TransformedData = {};

  departmentMap.forEach((data, department) => {
    // หาช่วงอายุ
    const minAge = Math.min(...data.ages);
    const maxAge = Math.max(...data.ages);

    // แปลงข้อมูลสีผม
    const hairColors: { [color: string]: number } = {};
    data.hairColors.forEach((count, color) => {
      hairColors[color] = count;
    });

    // แปลงข้อมูลที่อยู่
    const addressUsers: { [name: string]: string } = {};
    data.addresses.forEach((postalCode, name) => {
      addressUsers[name] = postalCode;
    });

    // สร้างข้อมูลสำหรับแผนก
    result[department] = {
      male: data.males.length,
      female: data.females.length,
      ageRange: `${minAge}-${maxAge}`,
      hair: hairColors,
      addressUser: addressUsers,
    };
  });

  return result;
};
