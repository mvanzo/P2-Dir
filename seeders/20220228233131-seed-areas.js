'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   return queryInterface.bulkInsert('areas', [{
     name: 'Crystal',
     latitude: '46.936969',
     longitude: '-121.472844',
     createdAt: new Date(),
     updatedAt: new Date()
   },
   {
     name: 'Snoqualmie Pass',
     latitude: '47.427747',
     longitude: '-121.417515',
     createdAt: new Date(),
     updatedAt: new Date()
   },
   {
    name: 'Stevens Pass',
    latitude: '47.744952',
    longitude: '-121.091639',
    createdAt: new Date(),
    updatedAt: new Date()
   },
   {
    name: 'Mount Baker Ski Area',
    latitude: '48.864194',
    longitude: '-121.680330',
    createdAt: new Date(),
    updatedAt: new Date()
   }], {});
  },


  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
