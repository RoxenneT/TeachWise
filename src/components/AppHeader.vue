<template>
  <header>
  </header>
</template>

<script>
import github from "../assets/github.svg";
import daily from "../assets/daily.svg";
import newtab from "../assets/newtab.svg";

export default {
  name: "AppHeader",
  data() {
    return {
      github,
      daily,
      newtab,
    };
  },
};
</script>

<style>
/* header {
  font-size: 12px;
  line-height: 16px;
  font-weight: bold;
  border-bottom: 1px solid #c8d1dc;
  padding: 2px;
  background-color: #fff;
}
header > div {
  max-width: 1200px;
  margin: auto;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.icon {
  height: 24px;
}
.row {
  display: flex;
  align-items: center;
}
.right-border {
  padding-right: 16px;
  border-right: 1px solid #c8d1dc;
  margin-right: 16px;
}
.button-link {
  border: 1px solid #c8d1dc;
  border-radius: 8px;
  padding: 7px 16px;
}
@media screen and (max-width: 700px) {
  .button-link {
    display: none;
  }
} */
</style>
