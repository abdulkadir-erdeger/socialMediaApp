import { StyleSheet } from "react-native";

export default StyleSheet.create({
  post: { width: "100%", marginVertical: 10, backgroundColor: "#fff" },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 10,
  },
  name: { fontWeight: "500" },
  subtitle: { color: "gray" },
  icon: { marginLeft: "auto" },
  //Body
  description: { paddingHorizontal: 10, lineHeight: 20, letterSpacing: 0.3 },
  image: {
    width: "100%",
    aspectRatio: 1,
    marginTop: 10,
  },
  //Footer
  footer: { paddingHorizontal: 10 },
  statsRow: {
    paddingVertical: 10,
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "lightgray",
  },
  likeIcon: { width: 20, height: 20, marginRight: 5 },
  likedBy: { color: "gray" },
  shares: {
    marginLeft: "auto",
    color: "gray",
  },
  // Buttons Row
  buttonsRow: {
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButtonText: { marginLeft: 5, color: "gray", fontWeight: "500" },
});
