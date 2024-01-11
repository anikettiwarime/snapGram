import UserCard from "@/components/shared/UserCard";
import { useTitle } from "@/hooks/useTitle";
import { useGetUsers } from "@/lib/react-query/queriesAndMutation";

const AllUsers = () => {
  useTitle("All Users");
  const { data: users } = useGetUsers();
  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        <ul className="user-grid">
          {users?.documents.map((user) => (
            <li key={user?.$id} className="flex-1 min-w-[200px] w-full">
              <UserCard user={user} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AllUsers;
