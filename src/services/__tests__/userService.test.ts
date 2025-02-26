import { User } from "@/types/user.types";
import { transformUserData } from "@/utils/transformUserData";

describe("transformUserData", () => {
  it("should transform user data correctly", () => {
    // ข้อมูลจำลอง
    const mockUsers = [
      {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        age: 30,
        gender: "male",
        email: "john@example.com",
        hair: { color: "Black", type: "straight" },
        address: {
          postalCode: "10001",
          city: "New York",
          state: "NY",
          address: "123 Main St",
          coordinates: { lat: 40.7128, lng: -74.006 },
        },
        company: {
          department: "Engineering",
          name: "Tech Corp",
          title: "Developer",
          address: {
            address: "123 Company St",
            city: "NY",
            postalCode: "10001",
            state: "NY",
            coordinates: { lat: 40.7128, lng: -74.006 },
          },
        },
      },
      {
        id: 2,
        firstName: "Jane",
        lastName: "Smith",
        age: 28,
        gender: "female",
        email: "jane@example.com",
        hair: { color: "Brown", type: "curly" },
        address: {
          postalCode: "20001",
          city: "Washington",
          state: "DC",
          address: "456 Oak St",
          coordinates: { lat: 38.9072, lng: -77.0369 },
        },
        company: {
          department: "Engineering",
          name: "Tech Corp",
          title: "Engineer",
          address: {
            address: "456 Company St",
            city: "DC",
            postalCode: "20001",
            state: "DC",
            coordinates: { lat: 38.9072, lng: -77.0369 },
          },
        },
      },
      {
        id: 3,
        firstName: "Mike",
        lastName: "Johnson",
        age: 35,
        gender: "male",
        email: "mike@example.com",
        hair: { color: "Brown", type: "straight" },
        address: {
          postalCode: "90001",
          city: "Los Angeles",
          state: "CA",
          address: "789 Pine St",
          coordinates: { lat: 34.0522, lng: -118.2437 },
        },
        company: {
          department: "Marketing",
          name: "Tech Corp",
          title: "Specialist",
          address: {
            address: "789 Company St",
            city: "LA",
            postalCode: "90001",
            state: "CA",
            coordinates: { lat: 34.0522, lng: -118.2437 },
          },
        },
      },
    ] as User[];

    const result = transformUserData(mockUsers);

    // ตรวจสอบผลลัพธ์
    expect(result).toHaveProperty("Engineering");
    expect(result).toHaveProperty("Marketing");

    // ตรวจสอบข้อมูล Engineering
    expect(result.Engineering.male).toBe(1);
    expect(result.Engineering.female).toBe(1);
    expect(result.Engineering.ageRange).toBe("28-30");
    expect(result.Engineering.hair).toEqual({ Black: 1, Brown: 1 });
    expect(result.Engineering.addressUser).toEqual({
      JohnDoe: "10001",
      JaneSmith: "20001",
    });

    // ตรวจสอบข้อมูล Marketing
    expect(result.Marketing.male).toBe(1);
    expect(result.Marketing.female).toBe(0);
    expect(result.Marketing.ageRange).toBe("35-35");
    expect(result.Marketing.hair).toEqual({ Brown: 1 });
    expect(result.Marketing.addressUser).toEqual({
      MikeJohnson: "90001",
    });
  });

  it("should handle empty user array", () => {
    const result = transformUserData([]);
    expect(result).toEqual({});
  });

  it("should skip users without department information", () => {
    const mockUsers = [
      {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        age: 30,
        gender: "male",
        email: "john@example.com",
        hair: { color: "Black", type: "straight" },
        address: {
          postalCode: "10001",
          city: "New York",
          state: "NY",
          address: "123 Main St",
          coordinates: { lat: 40.7128, lng: -74.006 },
        },
        // ไม่มีข้อมูล company
      },
    ] as User[];

    const result = transformUserData(mockUsers);
    expect(result).toEqual({});
  });
});
