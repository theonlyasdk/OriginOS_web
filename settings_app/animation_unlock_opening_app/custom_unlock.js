//animation unlock

const allAnimUnlock_GroupAnim = {
  anim1: [
    { ids: ["box10"] },
    { ids: ["box9", "box12"] },
    { ids: ["box5", "box8", "box11", "box6", "box7"] },
    { ids: ["box2", "box3", "box1", "box4"] },
  ],
  anim2: [
    {
      ids: [
        "box1",
        "box2",
        "box3",
        "box4",
        "box5",
        "box6",
        "box7",
        "box8",
        "box9",
        "box10",
        "box11",
        "box12",
      ],
    },
  ],
  anim3: [
    { ids: ["box10"] },
    { ids: ["box9", "box12"] },
    { ids: ["box6", "box7"] },
    { ids: ["box5", "box8", "box11"] },
    { ids: ["box2", "box3"] },
    { ids: ["box1", "box4"] },
  ],
};

const allAnimUnlock = {
  anim1: {
    box1: "translateX(-250px) translateY(290px) scale(2.6)",
    box2: "translateX(-80px) translateY(290px) scale(2.8)",
    box3: "translateX(80px) translateY(290px) scale(2.8)",
    box4: "translateX(250px) translateY(290px) scale(2.6)",
    box5: "translateX(190px) translateY(150px) scale(2.3)",
    box6: "translateX(65px) translateY(160px) scale(2.5)",
    box7: "translateX(-65px) translateY(160px) scale(2.5)",
    box8: "translateX(-190px) translateY(150px) scale(2.3)",
    box9: "translateX(-100px) translateY(60px) scale(2.3)",
    box10: "translateX(-110px) translateY(-40px) scale(2.3)",
    box12: "translateX(100px) translateY(20px) scale(2.3)",
    box11: "translateX(0px) translateY(-250px) scale(2.5)",
  },
  anim2: {
    box1: "translateX(0px) translateY(0px) scale(0.2)",
    box2: "translateX(0px) translateY(0px) scale(0.2)",
    box3: "translateX(0px) translateY(0px) scale(0.2)",
    box4: "translateX(0px) translateY(0px) scale(0.2)",
    box5: "translateX(0px) translateY(0px) scale(0.2)",
    box6: "translateX(0px) translateY(0px) scale(0.2)",
    box7: "translateX(0px) translateY(0px) scale(0.2)",
    box8: "translateX(0px) translateY(0px) scale(0.2)",
    box9: "translateX(0px) translateY(0px) scale(0.2)",
    box10: "translateX(0px) translateY(0px) scale(0.2)",
    box11: "translateX(0px) translateY(80px) scale(0.2)",
    box12: "translateX(0px) translateY(0px) scale(0.2)",
  },
  anim3: {
    box1: "translateX(62px) translateY(-165px) scale(0.38)",
    box2: "translateX(21px) translateY(-165px) scale(0.38)",
    box3: "translateX(-21px) translateY(-165px) scale(0.38)",
    box4: "translateX(-62px) translateY(-165px) scale(0.38)",
    box5: "translateX(-62px) translateY(-102px) scale(0.38)",
    box6: "translateX(-21px) translateY(-102px) scale(0.38)",
    box7: "translateX(21px) translateY(-102px) scale(0.38)",
    box8: "translateX(62px) translateY(-102px) scale(0.38)",
    box9: "translateX(42px) translateY(-60px) scale(0.38)",
    box10: "translateX(42px) translateY(-15px) scale(0.38)",
    box12: "translateX(-42px) translateY(-35px) scale(0.38)",
    box11: "translateX(0px) translateY(150px) scale(0.38)",
  },
  anim4: {
    box1: "scale(1)",
    box2: "scale(1)",
    box3: "scale(1)",
    box4: "scale(1)",
    box5: "scale(1)",
    box6: "scale(1)",
    box7: "scale(1)",
    box8: "scale(1)",
    box9: "scale(1)",
    box10: "scale(1)",
    box11: "scale(1)",
    box12: "scale(1)",
  },
  anim5: {
    box1: "translateY(100px)",
    box2: "translateY(100px)",
    box3: "translateY(100px)",
    box4: "translateY(100px)",
    box5: "translateY(100px)",
    box6: "translateY(100px)",
    box7: "translateY(100px)",
    box8: "translateY(100px)",
    box9: "translateY(100px)",
    box10: "translateY(100px)",
    box11: "translateY(100px)",
    box12: "translateY(100px)",
  },
};

// option animation
let anim_unlock = allAnimUnlock.anim3;
let groups_anim = allAnimUnlock_GroupAnim.anim1;

//animation unlock for preview in settings app

const allAnimUnlock_GroupAnim_pre = {
  anim1: [
    { ids: ["10", "11", "14", "15"] },
    { ids: ["9", "12", "13", "16"] },
    { ids: ["6", "7", "18", "19"] },
    { ids: ["5", "8", "17", "20"] },
    { ids: ["2", "3", "22", "23", "1", "4", "21", "24"] },
    { ids: ["26", "27", "25", "28"] },
  ],
  anim2: [
    {
      ids: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
      ],
    },
  ],
  anim3: [
    { ids: ["10", "11", "14", "15"] },
    { ids: ["9", "12", "13", "16"] },
    { ids: ["6", "7", "18", "19"] },
    { ids: ["5", "8", "17", "20"] },
    { ids: ["2", "3", "22", "23"] },
    { ids: ["1", "4", "21", "24"] },
    { ids: ["26", "27"] },
    { ids: ["25", "28"] },
  ],
};

const allAnimUnlock_pre = {
  anim1: {
    box1: "translateX(-45px) translateY(-50px) scale(2)",
    box2: "translateX(-15px) translateY(-50px) scale(2)",
    box3: "translateX(15px) translateY(-50px) scale(2)",
    box4: "translateX(45px) translateY(-50px) scale(2)",
    box5: "translateX(-45px) translateY(-30px) scale(2)",
    box6: "translateX(-15px) translateY(-30px) scale(2)",
    box7: "translateX(15px) translateY(-30px) scale(2)",
    box8: "translateX(45px) translateY(-30px) scale(2)",
    box9: "translateX(-45px) translateY(-10px) scale(2)",
    box10: "translateX(-15px) translateY(-10px) scale(2)",
    box11: "translateX(15px) translateY(-10px) scale(2)",
    box12: "translateX(45px) translateY(-10px) scale(2)",
    box13: "translateX(-45px) translateY(10px) scale(2)",
    box14: "translateX(-15px) translateY(10px) scale(2)",
    box15: "translateX(15px) translateY(10px) scale(2)",
    box16: "translateX(45px) translateY(10px) scale(2)",
    box17: "translateX(-45px) translateY(30px) scale(2)",
    box18: "translateX(-15px) translateY(30px) scale(2)",
    box19: "translateX(15px) translateY(30px) scale(2)",
    box20: "translateX(45px) translateY(30px) scale(2)",
    box21: "translateX(-45px) translateY(50px) scale(2)",
    box22: "translateX(-15px) translateY(50px) scale(2)",
    box23: "translateX(15px) translateY(50px) scale(2)",
    box24: "translateX(45px) translateY(50px) scale(2)",
    box25: "translateX(-45px) translateY(70px) scale(2)",
    box26: "translateX(-15px) translateY(70px) scale(2)",
    box27: "translateX(15px) translateY(70px) scale(2)",
    box28: "translateX(45px) translateY(70px) scale(2)",
  },
  anim2: {
    box1: "scale(0.2)",
    box2: "scale(0.2)",
    box3: "scale(0.2)",
    box4: "scale(0.2)",
    box5: "scale(0.2)",
    box6: "scale(0.2)",
    box7: "scale(0.2)",
    box8: "scale(0.2)",
    box9: "scale(0.2)",
    box10: "scale(0.2)",
    box11: "scale(0.2)",
    box12: "scale(0.2)",
    box13: "scale(0.2)",
    box14: "scale(0.2)",
    box15: "scale(0.2)",
    box16: "scale(0.2)",
    box17: "scale(0.2)",
    box18: "scale(0.2)",
    box19: "scale(0.2)",
    box20: "scale(0.2)",
    box21: "scale(0.2)",
    box22: "scale(0.2)",
    box23: "scale(0.2)",
    box24: "scale(0.2)",
    box25: "scale(0.2)",
    box26: "scale(0.2)",
    box27: "scale(0.2)",
    box28: "scale(0.2)",
  },
  anim3: {
    box1: "translateX(20px) translateY(50px) scale(0.5)",
    box2: "translateX(7px) translateY(50px) scale(0.5)",
    box3: "translateX(-7px) translateY(50px) scale(0.5)",
    box4: "translateX(-20px) translateY(50px) scale(0.5)",
    box5: "translateX(20px) translateY(30px) scale(0.5)",
    box6: "translateX(7px) translateY(30px) scale(0.5)",
    box7: "translateX(-7px) translateY(30px) scale(0.5)",
    box8: "translateX(-20px) translateY(30px) scale(0.5)",
    box9: "translateX(20px) translateY(10px) scale(0.5)",
    box10: "translateX(7px) translateY(10px) scale(0.5)",
    box11: "translateX(-7px) translateY(10px) scale(0.5)",
    box12: "translateX(-20px) translateY(10px) scale(0.5)",
    box13: "translateX(20px) translateY(-10px) scale(0.5)",
    box14: "translateX(7px) translateY(-10px) scale(0.5)",
    box15: "translateX(-7px) translateY(-10px) scale(0.5)",
    box16: "translateX(-20px) translateY(-10px) scale(0.5)",
    box17: "translateX(20px) translateY(-30px) scale(0.5)",
    box18: "translateX(7px) translateY(-30px) scale(0.5)",
    box19: "translateX(-7px) translateY(-30px) scale(0.5)",
    box20: "translateX(-20px) translateY(-30px) scale(0.5)",
    box21: "translateX(20px) translateY(-50px) scale(0.5)",
    box22: "translateX(7px) translateY(-50px) scale(0.5)",
    box23: "translateX(-7px) translateY(-50px) scale(0.5)",
    box24: "translateX(-20px) translateY(-50px) scale(0.5)",
    box25: "translateX(20px) translateY(-70px) scale(0.5)",
    box26: "translateX(7px) translateY(-70px) scale(0.5)",
    box27: "translateX(-7px) translateY(-70px) scale(0.5)",
    box28: "translateX(-20px) translateY(-70px) scale(0.5)",
  },
  anim4: {
    box1: "scale(1)",
    box2: "scale(1)",
    box3: "scale(1)",
    box4: "scale(1)",
    box5: "scale(1)",
    box6: "scale(1)",
    box7: "scale(1)",
    box8: "scale(1)",
    box9: "scale(1)",
    box10: "scale(1)",
    box11: "scale(1)",
    box12: "scale(1)",
    box13: "scale(1)",
    box14: "scale(1)",
    box15: "scale(1)",
    box16: "scale(1)",
    box17: "scale(1)",
    box18: "scale(1)",
    box19: "scale(1)",
    box20: "scale(1)",
    box21: "scale(1)",
    box22: "scale(1)",
    box23: "scale(1)",
    box24: "scale(1)",
    box25: "scale(1)",
    box26: "scale(1)",
    box27: "scale(1)",
    box28: "scale(1)",
  },
  anim5: {
    box1: "translateY(20px)",
    box2: "translateY(20px)",
    box3: "translateY(20px)",
    box4: "translateY(20px)",
    box5: "translateY(20px)",
    box6: "translateY(20px)",
    box7: "translateY(20px)",
    box8: "translateY(20px)",
    box9: "translateY(20px)",
    box10: "translateY(20px)",
    box11: "translateY(20px)",
    box12: "translateY(20px)",
    box13: "translateY(20px)",
    box14: "translateY(20px)",
    box15: "translateY(20px)",
    box16: "translateY(20px)",
    box17: "translateY(20px)",
    box18: "translateY(20px)",
    box19: "translateY(20px)",
    box20: "translateY(20px)",
    box21: "translateY(20px)",
    box22: "translateY(20px)",
    box23: "translateY(20px)",
    box24: "translateY(20px)",
    box25: "translateY(20px)",
    box26: "translateY(20px)",
    box27: "translateY(20px)",
    box28: "translateY(20px)",
  },
};

// option animation for preview
let anim_unlock_pre = allAnimUnlock_pre.anim1;
let groups_anim_pre = allAnimUnlock_GroupAnim_pre.anim1;

let IdTimeOut_show_unlock_anim_pre = null;
const items_unlock_anim_btn = document.querySelectorAll(".item_unlock_anim");
items_unlock_anim_btn.forEach((item) => {
  item.addEventListener("click", () => {
    items_unlock_anim_btn.forEach((el) => el.classList.remove("active"));
    item.classList.add("active");

    const dataAnim = item.dataset.anim;
    const dataGroup = item.dataset.group;

    anim_unlock = allAnimUnlock["anim" + dataAnim];
    groups_anim = allAnimUnlock_GroupAnim["anim" + dataGroup];

    anim_unlock_pre = allAnimUnlock_pre["anim" + dataAnim];
    groups_anim_pre = allAnimUnlock_GroupAnim_pre["anim" + dataGroup];

    localStorage.setItem("anim_unlock_saved", dataAnim);
    localStorage.setItem("groups_unlock_saved", dataGroup);

    Object.entries(anim_unlock_pre).forEach(([id, transform]) => {
      const box_pre = document.getElementById(`preview_${id}`);
      box_pre.style.transform = transform;
      box_pre.style.opacity = "0";
      box_pre.style.transition = "all 0s";
      box_pre.style.zIndex = "1";
    });

    clearTimeout(IdTimeOut_show_unlock_anim_pre);
    IdTimeOut_show_unlock_anim_pre = setTimeout(() => {
      groups_anim_pre.forEach((group, groupIndex) => {
        const delay = groupIndex * 0.1 * currentSpeed; // delay 0.1s
        group.ids.forEach((id) => {
          const box = document.getElementById(`preview_box${id}`);

          box.style.transition = `all ${timeUnlock}s cubic-bezier(.25,.1,${easingAnimationForUnlock},1), opacity ${currentSpeed3}s`;
          box.style.transitionDelay = `${delay}s`;
          box.style.transform = "translateX(0px) translateY(0px) scale(1)";
          box.style.opacity = "1";
          box.style.zIndex = "10";
        });
      });
    }, 10);
  });
});
