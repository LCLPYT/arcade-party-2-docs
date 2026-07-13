---
outline: deep
---

# Hooks
This page is a reference of provided hooks you can subscribe to.

::: info
This list may not contain all available hooks or may not be up to date 100%.
:::

To learn about how to work with hooks, please rad [Minigame logic → Hooks](/develop/developing-minigames/minigame-logic#hooks).

Hooks are contributed by several modules.
The tables below are grouped by the module that declares them.

## Reading the list
- **Hook** is the field you register on, written as `DeclaringType.FIELD`. Register it with
  `DeclaringType.FIELD.registerWith(hooks) { ... }`.
- **Signature** is the single callback method you implement (its parameters and return type).
- The **return type** tells you what you can influence:
  - a `boolean` hook is cancellable. Returning `true` cancels the event most of the time. If several listeners
    are registered, their results are often OR-ed, so any listener can cancel but all can react.
  - different hooks use different mechanisms to influence the result (not every hook works the same)
  - a `void`/`Unit` hook is notify-only.
- The **description** gives additional information about each hook.

## arcade-party-2
Events specific to Arcade Party.
Some hooks may be moved to kibu in the future...

### Actors
**`ActorSpawnedCallback.HOOK`**<br>
`void onSpawned(Actor actor)`

Fired after an actor has been spawned into the world. Notify-only.

**`ActorRemovedCallback.HOOK`**<br>
`void onRemoved(Actor actor)`

Fired after an actor has been removed. Notify-only.

### Core hooks
**`AnimalBreedCallback.HOOK`**<br>
`void onBreed(ServerPlayer breeder, Animal parent, Animal partner, AgeableMob child)`

Fired after two animals were bred into a child by a player. Notify-only.

**`DamageKnockbackCallback.HOOK`**<br>
`boolean shouldTakeKnockback(LivingEntity affected, DamageSource source, float damage)`

Fired when an entity is about to take knockback from damage. Return `true` to cancel the
knockback so the entity is not pushed.

**`EntityPathFindingCallback.HOOK`**<br>
`@Nullable Path modifyPath(Entity entity, @Nullable Path original, Set<BlockPos> targets, Function<BlockPos, @Nullable Path> pathFinder)`

Fired when an entity computes a navigation path. Return the path to use (the `original`, a new
one computed via `pathFinder`, or `null` for no path).

**`PlayerListEntriesOnJoinCallback.HOOK`**<br>
`Collection<ServerPlayer> shouldBeSent(Collection<ServerPlayer> players)`

Fired when the player-list entries are about to be sent to a joining player. Return the
collection of players whose entries should actually be sent (filter or replace the input).

**`ItemCraftedCallback.HOOK`**<br>
`void onCrafted(ServerPlayer player, ItemStack stack, int amount)`

Fired after a player crafted an item. Notify-only.

**`PlayerEliminatedCallback.HOOK`**<br>
`void onEliminated(ServerPlayer player)`

Fired when a player is eliminated from the running game. Notify-only.

**`DeathMessageItemCallback.HOOK`**<br>
`ItemStack modifyItem(DamageSource source, LivingEntity killed, ItemStack stack)`

Fired while building a death message, to choose the item icon shown next to it. Return the
`ItemStack` to display (return the unchanged `stack` to keep the default).

**`EntityAfterMoveCallback.HOOK`**<br>
`void afterMoveTick(Mob entity)`

Fired after a mob finished its move tick. Notify-only.

**`SpectatePlayerCallback.HOOK`**<br>
`boolean onSpectate(ServerPlayer spectator, Entity target)`

Fired when a spectator tries to start spectating a target. Return `true` to cancel, preventing
the spectate-action.

**`PlayerDisplayNameCallback.HOOK`**<br>
`Component modifyDisplayName(Player player, Component name)`

Fired when a player's display name is resolved. Return the name to show (return the unchanged
`name` to leave it as-is).

**`DripLeafTiltCallback.HOOK`**<br>
`boolean onTilt(Entity entity, BlockPos pos)`

Fired when a big dripleaf is about to tilt under an entity. Return `true` to cancel so the leaf
stays stable.

**`RangedWeaponUsedCallback.HOOK`**<br>
`void onShot(LivingEntity entity, ItemStack stack, int remainingUseTicks)`

Fired when a ranged weapon (bow or crossbow) is released. Notify-only.

**`EnderPearlTeleportCallback.HOOK`**<br>
`boolean onTeleport(Entity owner, ThrownEnderpearl enderPearl, Vec3 pos)`

Fired when a thrown ender pearl is about to teleport its owner. Return `true` to cancel the
teleport.

**`CreakingLookedAtCheckCallback.HOOK`**<br>
`PendingResult<Boolean> isBeingLookedAt(Creaking creaking)`

Fired while checking whether a creaking is currently being looked at. Return a `PendingResult`
resolving to the answer to override the vanilla check.

**`ExplosionAffectedEntitiesCallback.HOOK`**<br>
`List<Entity> overrideAffectedEntities(Explosion explosion, List<Entity> affected)`

Fired when an explosion has computed the entities it affects. Return the list of entities that
should actually be affected (filter or replace the input).

**`PlayerDeathMessageCallback.HOOK`**<br>
`Component modifyDeathMessage(ServerPlayer player, DamageSource source, Component currentMsg)`

Fired while a player's death message is built. Return the message to use (return `currentMsg` to
leave it unchanged).

**`EntitySpawnCallback.HOOK`**<br>
`boolean onSpawn(Entity entity, ServerLevel world)`

Fired when an entity is about to spawn into a world. Return `true` to cancel the spawn.

**`ProjectileShootCallback.HOOK`**<br>
`void onShoot(LivingEntity shooter, Projectile projectile)`

Fired when a living entity shoots a projectile. Notify-only.

**`ProjectileHitEntityCallback.HOOK`**<br>
`void onHitEntity(Projectile projectile, EntityHitResult hit)`

Fired when a projectile hits an entity. Notify-only.

**`PlayerCanTrackCallback.HOOK`**<br>
`boolean canTrack(ServerPlayer player, Entity entity)`

Fired while deciding whether a player may track (receive updates for) an entity. Return `true`
to prevent the player from tracking the entity.

**`CopperGolemTurnIntoStatueCallback.HOOK`**<br>
`boolean onTurnIntoStatue(CopperGolem copperGolem)`

Fired when a copper golem is about to oxidize into a statue. Return `true` to cancel so it stays
active.

**`EntitySpawnedByCallback.HOOK`**<br>
`void onSpawned(ServerLevel level, Entity entity, @Nullable ItemStack stack, @Nullable LivingEntity user, EntitySpawnReason reason)`

Fired after an entity was spawned by an item or a user (e.g. a spawn egg). Notify-only.

**`LivingEntityAttributeInitCallback.HOOK`**<br>
`void onAttributesInitialized(LivingEntity living)`

Fired after a living entity's attributes were initialized, a good point to adjust base
attribute values. Notify-only.

**`EntityPushEntityCallback.HOOK`**<br>
`boolean onPush(Entity pushed, Entity pusher)`

Fired when one entity pushes another through collision. Return `true` to cancel the push.

**`CobwebSlowCallback.HOOK`**<br>
`boolean cancelSlow(Entity entity, BlockPos pos)`

Fired when an entity inside a cobweb would be slowed down. Return `true` to cancel the slowdown
so the entity moves normally.

**`CanShootProjectileCallback.HOOK`**<br>
`boolean canShoot(LivingEntity shooter, ItemStack stack, InteractionHand hand)`

Fired while checking whether a shooter may fire a projectile. Return `true` to prevent shooting.

**`FrozenTickChangeCallback.HOOK`**<br>
`boolean onFrozenTicksChange(Entity entity, int ticks)`

Fired when an entity's powder-snow freeze ticks are about to change. Return `true` to cancel the
change and keep the current value.

**`ArmorAbsorbDamageCallback.HOOK`**<br>
`boolean mayAbsorbDamage(LivingEntity victim, DamageSource source, float damage)`

Fired while checking whether the victim's armor may absorb incoming damage. Return `true` to
prevent armor from absorbing the damage.

**`PowderedSnowSlowCallback.ADD`**<br>
`boolean shouldCancel(LivingEntity entity)`

Fired when an entity starts being slowed by powder snow. Return `true` to cancel so the slowness
is not applied.

**`PowderedSnowSlowCallback.REMOVE`**<br>
`boolean shouldCancel(LivingEntity entity)`

Fired when an entity stops being slowed by powder snow. Return `true` to cancel so the slowness
is not removed yet.

**`BrainCreationCallback.Warden.HOOK`**<br>
`@Nullable Brain<Warden> createBrain(Warden entity, Supplier<Brain<Warden>> brainGetter)`

Fired when a warden's brain is created. Return a custom `Brain` to override the AI, or the
result of `brainGetter` for the default.

**`BrainCreationCallback.Creaking.HOOK`**<br>
`@Nullable Brain<Creaking> createBrain(Creaking entity, Supplier<Brain<Creaking>> brainGetter)`

Fired when a creaking's brain is created. Return a custom `Brain` to override the AI, or the
result of `brainGetter` for the default.

## kibu
kibu is the main event/util library. 
Its hooks live in several submodules.

### kibu-hooks
General server, world, player and entity hooks.

#### Level and blocks
**`ServerWorldReadyCallback.HOOK`**<br>
`void onWorldReady(MinecraftServer server)`

Fired when a server world has become ready for use. Notify-only.

**`ServerWorldUnreadyCallback.HOOK`**<br>
`void onWorldUnready(MinecraftServer server)`

Fired when a server world becomes unready (e.g. before unload). Notify-only.

**`FarmlandMoistureChangeCallback.HOOK`**<br>
`boolean onMoistureChange(ServerLevel world, BlockPos pos, int moisture)`

Fired when farmland moisture is about to change. Return `true` to cancel and keep the current
moisture.

**`BlockBreakParticleCallback.HOOK`**<br>
`boolean onSpawnParticles(Level world, BlockPos pos, BlockState state)`

Fired when block break particles are about to spawn. Return `true` to cancel the particles.

**`PressurePlateCallback.HOOK`**<br>
`boolean onPress(Level world, BlockPos pos, Entity entity)`

Fired when an entity presses a pressure plate. Return `true` to cancel the activation.

**`ItemScatterCallback.HOOK`**<br>
`boolean onScatter(Level world, double x, double y, double z, ItemStack stack)`

Fired when an item is about to be scattered into the world (e.g. contents of a broken
container). Return `true` to cancel the drop.

#### Block modification (`BlockModificationHooks`)
**`BlockModificationHooks.PLACE_BLOCK`**<br>
`boolean onPlace(Level world, BlockPos pos, Entity entity, BlockState newState)`

Fired before an entity places a block. Return `true` to cancel the placement so the world is
left unchanged.

**`BlockModificationHooks.BLOCK_PLACED`**<br>
`void onModified(Level world, BlockPos pos, Entity entity)`

Fired after a block was placed. Notify-only.

**`BlockModificationHooks.BREAK_BLOCK`**<br>
`boolean onModify(Level world, BlockPos pos, Entity entity)`

Fired before an entity breaks a block. Return `true` to cancel the break.

**`BlockModificationHooks.BLOCK_BROKEN`**<br>
`void onModified(Level world, BlockPos pos, Entity entity)`

Fired after a block was broken. Notify-only.

**`BlockModificationHooks.PLACE_FLUID`**<br>
`boolean onTransfer(Level world, BlockPos pos, Entity entity, Fluid fluid)`

Fired before a fluid is placed (e.g. emptying a bucket). Return `true` to cancel.

**`BlockModificationHooks.PICKUP_FLUID`**<br>
`boolean onTransfer(Level world, BlockPos pos, Entity entity, Fluid fluid)`

Fired before a fluid is picked up (e.g. filling a bucket). Return `true` to cancel.

**`BlockModificationHooks.USE_ITEM_ON_BLOCK`**<br>
`InteractionResult onUse(UseOnContext ctx)`

Fired when an item is used on a block. Return an `InteractionResult`; `FAIL` cancels the
interaction, `PASS` lets vanilla continue.

**`BlockModificationHooks.TRAMPLE_FARMLAND`**<br>
`boolean onModify(Level world, BlockPos pos, Entity entity)`

Fired before farmland is trampled back into dirt. Return `true` to cancel.

**`BlockModificationHooks.TRAMPLE_TURTLE_EGG`**<br>
`boolean onModify(Level world, BlockPos pos, Entity entity)`

Fired before a turtle egg is trampled. Return `true` to cancel.

**`BlockModificationHooks.EAT_CAKE`**<br>
`boolean onModify(Level world, BlockPos pos, Entity entity)`

Fired before a cake slice is eaten. Return `true` to cancel.

**`BlockModificationHooks.CAN_MOB_GRIEF`**<br>
`boolean onModify(Level world, BlockPos pos, Entity entity)`

Fired while checking whether a mob may grief a block (e.g. an enderman picking it up). Return
`true` to prevent the griefing.

**`BlockModificationHooks.EXTINGUISH_CANDLE`**<br>
`boolean onModify(Level world, BlockPos pos, Entity entity)`

Fired before a lit candle is extinguished. Return `true` to cancel.

**`BlockModificationHooks.COMPOSTER`**<br>
`boolean onModify(Level world, BlockPos pos, Entity entity)`

Fired before a composter is used. Return `true` to cancel.

**`BlockModificationHooks.CHARGE_RESPAWN_ANCHOR`**<br>
`boolean onModify(Level world, BlockPos pos, Entity entity)`

Fired before a respawn anchor is charged. Return `true` to cancel.

**`BlockModificationHooks.EXPLODE_RESPAWN_LOCATION`**<br>
`boolean onModify(Level world, BlockPos pos, Entity entity)`

Fired before a respawn location explodes (e.g. bed or anchor in the wrong dimension). Return
`true` to cancel.

**`BlockModificationHooks.PRIME_TNT`**<br>
`boolean onModify(Level world, BlockPos pos, Entity entity)`

Fired before TNT is primed. Return `true` to cancel.

**`BlockModificationHooks.TAKE_LECTERN_BOOK`**<br>
`boolean onModify(Level world, BlockPos pos, Entity entity)`

Fired before a book is taken from a lectern. Return `true` to cancel.

**`BlockModificationHooks.EDIT_SIGN`**<br>
`boolean onModify(Level world, BlockPos pos, Entity entity)`

Fired before a sign is edited. Return `true` to cancel.

**`BlockModificationHooks.DECORATIVE_POT_STORE`**<br>
`boolean onModify(Level world, BlockPos pos, Entity entity)`

Fired before an item is stored in a decorated pot. Return `true` to cancel.

#### Level physics (`LevelPhysicsHooks`)
**`LevelPhysicsHooks.EXPLOSION`**<br>
`boolean onExplode(ServerExplosion explosion)`

Fired when an explosion is about to occur. Return `true` to cancel it.

**`LevelPhysicsHooks.MELT`**<br>
`boolean onFade(Level world, BlockPos pos)`

Fired before a block melts (e.g. ice or snow). Return `true` to cancel.

**`LevelPhysicsHooks.FREEZE`**<br>
`boolean onFade(Level world, BlockPos pos)`

Fired before water freezes. Return `true` to cancel.

**`LevelPhysicsHooks.CORAL_DEATH`**<br>
`boolean onFade(Level world, BlockPos pos)`

Fired before coral dies out of water. Return `true` to cancel.

**`LevelPhysicsHooks.REPLACE_DISK_ENCHANTMENT`**<br>
`boolean onApply(Level world, BlockPos pos, @Nullable LivingEntity entity, BlockState state)`

Fired when a frost-walker style enchantment replaces blocks in a disk around an entity. Return
`true` to cancel.

**`LevelPhysicsHooks.SNOW_FALL`**<br>
`boolean onSnowFall(Level world, BlockPos pos)`

Fired before snow accumulates on a block. Return `true` to cancel.

**`LevelPhysicsHooks.CAULDRON_PRECIPITATION`**<br>
`boolean onChange(Level world, BlockPos pos, BlockState newState)`

Fired when a cauldron is about to fill from precipitation. Return `true` to cancel.

**`LevelPhysicsHooks.CAULDRON_DRIP_STONE`**<br>
`boolean onChange(Level world, BlockPos pos, BlockState newState)`

Fired when a cauldron is about to fill from a pointed dripstone. Return `true` to cancel.

**`LevelPhysicsHooks.BLOCK_ITEM_DROP`**<br>
`boolean onTileDrop(Level world, BlockPos pos, ItemStack stack)`

Fired before a block drops an item. Return `true` to cancel the drop.

**`LevelPhysicsHooks.BLOCK_XP_DROP`**<br>
`boolean onTileDropExperience(Level world, BlockPos pos, int xp)`

Fired before a block drops experience. Return `true` to cancel the drop.

#### Network
**`CustomClickActionCallback.HOOK`**<br>
`void onCustomClickAction(ServerPlayer player, Identifier id, Optional<Tag> payload)`

Fired when a custom click action (e.g. from a `custom` click event in a component) is received.
Notify-only.

**`ServerSendPacketCallback.HOOK`**<br>
`PendingResult<Packet<?>> overridePacket(Packet<?> packet, ServerCommonPacketListenerImpl handler)`

Fired when the server is about to send a packet. Return a `PendingResult` with the packet to
send instead, or the unchanged packet to leave it as-is.

#### Player
**`PlayerMoveCallback.HOOK`**<br>
`boolean onMove(ServerPlayer player, PositionRotation from, PositionRotation to)`

Fired when a player changes position or rotation. Return `true` to cancel the movement.

**`PlayerJumpCallback.HOOK`**<br>
`boolean onJump(ServerPlayer player)`

Fired when a player jumps. Return `true` to cancel.

**`PlayerSneakCallback.HOOK`**<br>
`boolean onSneak(ServerPlayer player, boolean sneaking)`

Fired when a player toggles sneaking. Return `true` to cancel the change.

**`PlayerSprintCallback.HOOK`**<br>
`void onSprint(ServerPlayer player, boolean sprinting)`

Fired when a player toggles sprinting. Notify-only.

**`PlayerInputCallback.HOOK`**<br>
`void onInput(ServerPlayer player, Input input)`

Fired when a player's movement input (WASD, jump, sneak) changes. Notify-only.

**`PlayerToggleFlightCallback.HOOK`**<br>
`boolean onToggleFlight(ServerPlayer player, boolean fly)`

Fired when a player toggles flight. Return `true` to cancel the change.

**`PlayerSwingHandHook.HOOK`**<br>
`void onSwingHand(ServerPlayer player, InteractionHand hand)`

Fired when a player swings a hand. Notify-only.

**`PlayerDeathCallback.HOOK`**<br>
`void onDeath(ServerPlayer player, DamageSource source)`

Fired when a player dies. Notify-only.

**`PlayerTeleportedCallback.HOOK`**<br>
`void onTeleported(ServerPlayer player)`

Fired after a player has been teleported. Notify-only.

**`PlayerGameModeChangeCallback.HOOK`**<br>
`void onChangeGameMode(ServerPlayer player, GameType gameMode)`

Fired when a player's game mode changes. Notify-only.

**`PlayerSpawnLocationCallback.HOOK`**<br>
`void onSpawn(LocationData data)`

Fired when a player's initial spawn location is resolved. Mutate the provided `data` to change
where the player spawns.

**`PlayerSpawnPointChangeCallback.HOOK`**<br>
`boolean onChange(Player player, Level world, BlockPos pos)`

Fired when a player's spawn point is about to change (e.g. sleeping in a bed). Return `true` to
cancel the change.

**`PlayerWaypointCallback.HOOK`**<br>
`boolean onRefreshTracking(ServerPlayer player, WaypointTransmitter waypoint)`

Fired when a player's waypoint (locator bar) tracking is refreshed. Return `true` to cancel.

**`PlayerAdvancementPacketCallback.HOOK`**<br>
`boolean onAdvancementUpdate(ServerPlayer player, ClientboundUpdateAdvancementsPacket packet)`

Fired before an advancement update packet is sent to a player. Return `true` to cancel sending.

**`PlayerRecipeNotificationCallback.HOOK`**<br>
`boolean onDisplay(ServerPlayer player, RecipeHolder<?> recipeEntry, RecipeDisplayEntry displayEntry)`

Fired before a recipe unlock (toast) notification is displayed. Return `true` to cancel.

**`CraftingRecipeCallback.HOOK`**<br>
`PendingResult<ItemStack> modifyRecipe(ServerPlayer player, CraftingInput input, ItemStack result)`

Fired when a crafting result is computed. Return a `PendingResult` with the resulting item to
override it, or the unchanged `result`.

#### Player connection (`PlayerConnectionHooks`)
**`PlayerConnectionHooks.JOIN`**<br>
`void act(ServerPlayer player)`

Fired when a player joins the server. Notify-only.

**`PlayerConnectionHooks.QUIT`**<br>
`void act(ServerPlayer player)`

Fired when a player quits the server. Notify-only.

**`PlayerConnectionHooks.JOIN_MESSAGE`**<br>
`Component onJoin(ServerPlayer player, Component message)`

Fired while building the join broadcast message. Return the message to broadcast, or `null` to
suppress it.

**`PlayerConnectionHooks.QUIT_MESSAGE`**<br>
`Component onQuit(ServerPlayer player, Component message)`

Fired while building the quit broadcast message. Return the message to broadcast, or `null` to
suppress it.

#### Player inventory (`PlayerInventoryHooks`)
**`PlayerInventoryHooks.SLOT_CHANGE`**<br>
`void onChangeSlot(ServerPlayer player, int slot)`

Fired when a player's selected hotbar slot changes. Notify-only.

**`PlayerInventoryHooks.DROP_ITEM`**<br>
`boolean onDropItem(Player player, int slot, boolean inInventory)`

Fired before a player drops an item from a slot. Return `true` to cancel the drop.

**`PlayerInventoryHooks.DROPPED_ITEM`**<br>
`void onDroppedItem(Player player, int slot)`

Fired after a player dropped an item from a slot. Notify-only.

**`PlayerInventoryHooks.DROP_ITEM_ENTITY`**<br>
`boolean onDropItemEntity(ServerPlayer player, ItemEntity itemEntity)`

Fired before the dropped item entity is created. Return `true` to cancel.

**`PlayerInventoryHooks.DROPPED_ITEM_ENTITY`**<br>
`void onDroppedItemEntity(ServerPlayer player, ItemEntity itemEntity)`

Fired after the dropped item entity was created. Notify-only.

**`PlayerInventoryHooks.SWAP_HANDS`**<br>
`boolean onSwapHands(ServerPlayer player, int slot)`

Fired before a player swaps main and off hand. Return `true` to cancel.

**`PlayerInventoryHooks.SWAPPED_HANDS`**<br>
`void onSwappedHands(ServerPlayer player, int slot)`

Fired after a player swapped hands. Notify-only.

**`PlayerInventoryHooks.MODIFY_INVENTORY`**<br>
`boolean onModify(ClickEvent event)`

Fired before an inventory click modifies the inventory. Return `true` to cancel the click.

**`PlayerInventoryHooks.MODIFIED_INVENTORY`**<br>
`void onModified(ClickEvent event)`

Fired after an inventory click modified the inventory. Notify-only.

**`PlayerInventoryHooks.MODIFY_CREATIVE_INVENTORY`**<br>
`void onModify(CreativeClickEvent event)`

Fired before a creative-mode inventory action is applied. Notify-only.

**`PlayerInventoryHooks.MODIFIED_CREATIVE_INVENTORY`**<br>
`void onModified(CreativeClickEvent event)`

Fired after a creative-mode inventory action was applied. Notify-only.

**`PlayerInventoryHooks.PLAYER_PICKUP`**<br>
`boolean onPickup(Player player, ItemEntity itemEntity)`

Fired before a player picks up an item entity. Return `true` to cancel the pickup.

**`PlayerInventoryHooks.PLAYER_PICKED_UP`**<br>
`void onPickedUp(Player player, ItemEntity itemEntity)`

Fired after a player picked up an item entity. Notify-only.

#### Player mount (`PlayerMountHooks`)
**`PlayerMountHooks.MOUNTED`**<br>
`void doAfter(ServerPlayer player, Entity vehicle)`

Fired after a player mounted a vehicle. Notify-only.

**`PlayerMountHooks.DISMOUNTED`**<br>
`void doAfter(ServerPlayer player, Entity vehicle)`

Fired after a player dismounted a vehicle. Notify-only.

#### Player food (`PlayerFoodHooks`)
**`PlayerFoodHooks.SATURATION_CHANGE`**<br>
`boolean onChange(Player player, float fromLevel, float toLevel)`

Fired before a player's saturation changes. Return `true` to cancel and keep the current value.

**`PlayerFoodHooks.EXHAUSTION_CHANGE`**<br>
`boolean onChange(Player player, float fromLevel, float toLevel)`

Fired before a player's exhaustion changes. Return `true` to cancel and keep the current value.

**`PlayerFoodHooks.LEVEL_CHANGE`**<br>
`boolean onChange(Player player, int fromLevel, int toLevel)`

Fired before a player's food level changes. Return `true` to cancel and keep the current value.

#### Entity
**`EntityDamageCallback.HOOK`**<br>
`boolean onDamage(LivingEntity entity, DamageSource source, float amount)`

Fired before a living entity takes damage. Return `true` to cancel the damage.

**`EntityHealthCallback.HOOK`**<br>
`boolean onHealthChange(LivingEntity entity, float health)`

Fired before a living entity's health changes. Return `true` to cancel the change.

**`NonLivingDamageCallback.HOOK`**<br>
`boolean onDamage(Entity entity, DamageSource source, float amount)`

Fired before a non-living entity (e.g. an item frame or boat) takes damage. Return `true` to
cancel.

**`EntityRemovedCallback.HOOK`**<br>
`void onRemove(Entity entity, Entity.RemovalReason removalReason)`

Fired after an entity is removed, with the reason. Notify-only.

**`EntityConvertCallback.HOOK`**<br>
`boolean onConvert(Mob entity, EntityType<?> type)`

Fired before a mob converts into another type (e.g. a zombie into a drowned). Return `true` to
cancel.

**`EntityTargetCallback.HOOK`**<br>
`boolean onChangeTarget(Mob entity, @Nullable LivingEntity target)`

Fired before a mob changes its attack target. Return `true` to cancel the change.

**`EntityStatusEffectCallback.HOOK`**<br>
`boolean onAddEffect(LivingEntity entity, MobEffectInstance effect, @Nullable Entity source)`

Fired before a status effect is added to an entity. Return `true` to cancel.

**`EntityMountCallback.HOOK`**<br>
`boolean onMount(Entity entity, Entity vehicle, boolean force)`

Fired before an entity mounts a vehicle. Return `true` to cancel.

**`EntityDismountCallback.HOOK`**<br>
`boolean onDismount(Entity entity, Entity vehicle)`

Fired before an entity dismounts a vehicle. Return `true` to cancel.

**`EntityTeleportCallback.HOOK`**<br>
`boolean onTeleport(Entity entity, double x, double y, double z)`

Fired before an entity teleports. Return `true` to cancel.

**`EntityUsePortalCallback.HOOK`**<br>
`boolean onUsePortal(Entity entity, Portal portal, BlockPos pos)`

Fired before an entity uses a portal. Return `true` to cancel.

**`EntityDropItemCallback.HOOK`**<br>
`boolean onDropItem(Level world, Entity entity, ItemEntity itemEntity)`

Fired before an entity drops an item. Return `true` to cancel.

**`EntityBossBarCallback.HOOK`**<br>
`boolean onShow(Entity entity, ServerBossEvent bossBar, ServerPlayer player)`

Fired before an entity's boss bar is shown to a player. Return `true` to cancel.

**`AffectedByDaylightCallback.HOOK`**<br>
`boolean shouldIgnoreDaylight(Mob entity)`

Fired while checking whether a mob is affected by daylight. Return `true` to make the mob ignore
daylight so it does not burn in the sun.

**`ItemUseOnEntityCallback.HOOK`**<br>
`boolean onUseOnEntity(Player player, LivingEntity entity, InteractionHand hand, ItemStack stack)`

Fired before an item is used on an entity. Return `true` to cancel.

**`WitherShootCallback.HOOK`**<br>
`boolean onShootAt(WitherBoss wither, double targetX, double targetY, double targetZ)`

Fired before a wither shoots a skull at a target. Return `true` to cancel.

**`ProjectilePickupCallback.HOOK`**<br>
`boolean onPickup(Player player, AbstractArrow projectile)`

Fired before a player picks up a stuck projectile (e.g. an arrow). Return `true` to cancel.

**`ProjectileCanHitCallback.HOOK`**<br>
`boolean canHit(Projectile projectile, Entity entity)`

Fired while checking whether a projectile can hit an entity. Return `true` to prevent the hit.

**`ArmorStandManipulateCallback.HOOK`**<br>
`boolean onManipulate(ArmorStand armorStand, Player player, EquipmentSlot slot, ItemStack stack, InteractionHand hand)`

Fired before an armor stand is manipulated (equipping or taking items). Return `true` to cancel.

**`ItemFramePutItemCallback.HOOK`**<br>
`boolean onPutIntoFrame(ItemFrame itemFrame, ItemStack stack, Player player, InteractionHand hand)`

Fired before an item is put into an item frame. Return `true` to cancel.

**`ItemFrameRemoveItemCallback.HOOK`**<br>
`boolean onRemoveItem(ItemFrame itemFrame, @Nullable Entity attacker)`

Fired before an item is removed from an item frame. Return `true` to cancel.

**`ItemFrameRotateCallback.HOOK`**<br>
`boolean onRotateFrame(ItemFrame itemFrame, Player player, InteractionHand hand)`

Fired before an item frame's item is rotated. Return `true` to cancel.

**`ProjectileHooks.HIT_BLOCK`**<br>
`void onHitBlock(Projectile projectile, BlockHitResult hit)`

Fired when a projectile hits a block. Notify-only.

**`ProjectileHooks.BREAK_DECORATED_POT`**<br>
`boolean onAffect(Projectile projectile, BlockHitResult hit)`

Fired before a projectile breaks a decorated pot. Return `true` to cancel.

#### Entity leashing
**`LeashEntityCallback.HOOK`**<br>
`boolean onLeash(Player player, Entity entity)`

Fired before a player leashes an entity. Return `true` to cancel.

**`UnleashEntityCallback.HOOK`**<br>
`boolean onUnleash(Player player, Entity entity)`

Fired before a player unleashes an entity. Return `true` to cancel.

**`LeashEntitiesToEntityCallback.HOOK`**<br>
`boolean onLeashToEntity(Player player, Entity leashHolder, Collection<Entity> entities)`

Fired before entities are leashed to another entity. Return `true` to cancel.

**`LeashEntitiesToBlockCallback.HOOK`**<br>
`boolean onLeashToBlock(Player player, BlockPos pos, Collection<Entity> entities)`

Fired before entities are leashed to a block (fence). Return `true` to cancel.

**`LeashKnotTakeCallback.HOOK`**<br>
`boolean onTakeHold(Player player, LeashFenceKnotEntity leashKnot)`

Fired before a player takes hold of a leash knot. Return `true` to cancel.

**`LeashDestroyCallback.HOOK`**<br>
`boolean onLeashDestroy(Player player, Entity leashed)`

Fired before a leash is destroyed. Return `true` to cancel.

### kibu-fabric-hooks
These wrap [Fabric API](https://docs.fabricmc.net/develop/events) events so they can be unregistered like other kibu hooks. 
The callback type is the Fabric API interface, so the exact method signature is defined by Fabric API.

**`ServerLevelHooks.LOAD`**<br>
`void onLevelLoad(MinecraftServer server, ServerLevel level)`

Fired when a server level loads. Notify-only.

**`ServerLevelHooks.UNLOAD`**<br>
`void onLevelUnload(MinecraftServer server, ServerLevel level)`

Fired when a server level unloads. Notify-only.

**`ServerChunkHooks.CHUNK_LOAD`**<br>
`void onChunkLoad(ServerLevel level, LevelChunk chunk, boolean generated)`

Fired when a chunk loads. Notify-only.

**`ServerChunkHooks.CHUNK_UNLOAD`**<br>
`void onChunkUnload(ServerLevel level, LevelChunk chunk)`

Fired when a chunk unloads. Notify-only.

**`ServerBlockEntityHooks.BLOCK_ENTITY_LOAD`**<br>
`void onLoad(BlockEntity blockEntity, ServerLevel level)`

Fired when a block entity loads. Notify-only.

**`ServerBlockEntityHooks.BLOCK_ENTITY_UNLOAD`**<br>
`void onUnload(BlockEntity blockEntity, ServerLevel level)`

Fired when a block entity unloads. Notify-only.

**`ServerTickHooks.START_SERVER_TICK`**<br>
`void onStartTick(MinecraftServer server)`

Fired at the start of each server tick. Notify-only.

**`ServerTickHooks.END_SERVER_TICK`**<br>
`void onEndTick(MinecraftServer server)`

Fired at the end of each server tick. Notify-only.

**`ServerTickHooks.START_LEVEL_TICK`**<br>
`void onStartTick(ServerLevel level)`

Fired at the start of each level tick. Notify-only.

**`ServerTickHooks.END_LEVEL_TICK`**<br>
`void onEndTick(ServerLevel level)`

Fired at the end of each level tick. Notify-only.

**`ServerLifecycleHooks.SERVER_STARTING`**<br>
`void onServerStarting(MinecraftServer server)`

Fired while the server is starting. Notify-only.

**`ServerLifecycleHooks.SERVER_STARTED`**<br>
`void onServerStarted(MinecraftServer server)`

Fired once the server has started. Notify-only.

**`ServerLifecycleHooks.SERVER_STOPPING`**<br>
`void onServerStopping(MinecraftServer server)`

Fired while the server is stopping. Notify-only.

**`ServerLifecycleHooks.SERVER_STOPPED`**<br>
`void onServerStopped(MinecraftServer server)`

Fired once the server has stopped. Notify-only.

**`ServerLifecycleHooks.START_DATA_PACK_RELOAD`**<br>
`void startDataPackReload(MinecraftServer server, CloseableResourceManager resourceManager)`

Fired when a data pack reload starts. Notify-only.

**`ServerLifecycleHooks.END_DATA_PACK_RELOAD`**<br>
`void endDataPackReload(MinecraftServer server, CloseableResourceManager resourceManager, boolean success)`

Fired when a data pack reload ends, with whether it succeeded. Notify-only.

**`ServerPlayConnectionHooks.INIT`**<br>
`void onPlayInit(ServerGamePacketListenerImpl listener, MinecraftServer server)`

Fired when a play connection is initialized. Notify-only.

**`ServerPlayConnectionHooks.JOIN`**<br>
`void onPlayReady(ServerGamePacketListenerImpl listener, PacketSender sender, MinecraftServer server)`

Fired when a play connection is ready (player joined). Notify-only.

**`ServerPlayConnectionHooks.DISCONNECT`**<br>
`void onPlayDisconnect(ServerGamePacketListenerImpl listener, MinecraftServer server)`

Fired when a play connection disconnects. Notify-only.

**`ServerMessageHooks.ALLOW_CHAT_MESSAGE`**<br>
`boolean allowChatMessage(PlayerChatMessage message, ServerPlayer sender, ChatType.Bound boundChatType)`

Fired before a chat message is broadcast. Return `false` to block the message.

**`ServerMessageHooks.ALLOW_GAME_MESSAGE`**<br>
`boolean allowGameMessage(MinecraftServer server, Component message, boolean overlay)`

Fired before a game (system) message is broadcast. Return `false` to block it.

**`ServerMessageHooks.ALLOW_COMMAND_MESSAGE`**<br>
`boolean allowCommandMessage(PlayerChatMessage message, CommandSourceStack source, ChatType.Bound boundChatType)`

Fired before a command-sourced message (e.g. `/say`, `/msg`) is broadcast. Return `false` to
block it.

**`ServerMessageHooks.CHAT_MESSAGE`**<br>
`void onChatMessage(PlayerChatMessage message, ServerPlayer sender, ChatType.Bound boundChatType)`

Fired after a chat message was broadcast. Notify-only.

**`ServerMessageHooks.GAME_MESSAGE`**<br>
`void onGameMessage(MinecraftServer server, Component message, boolean overlay)`

Fired after a game message was broadcast. Notify-only.

**`ServerMessageHooks.COMMAND_MESSAGE`**<br>
`void onCommandMessage(PlayerChatMessage message, CommandSourceStack source, ChatType.Bound boundChatType)`

Fired after a command-sourced message was broadcast. Notify-only.

**`ServerLivingEntityHooks.ALLOW_DAMAGE`**<br>
`boolean allowDamage(LivingEntity entity, DamageSource source, float amount)`

Fired before a living entity takes damage. Return `false` to prevent the damage.

**`ServerLivingEntityHooks.ALLOW_DEATH`**<br>
`boolean allowDeath(LivingEntity entity, DamageSource damageSource, float damageAmount)`

Fired when lethal damage would kill a living entity. Return `false` to prevent death (the entity
stays at low health).

**`ServerLivingEntityHooks.AFTER_DEATH`**<br>
`void afterDeath(LivingEntity entity, DamageSource damageSource)`

Fired after a living entity died. Notify-only.

**`ServerEntityCombatHooks.AFTER_KILLED_OTHER_ENTITY`**<br>
`void afterKilledOtherEntity(ServerLevel level, Entity entity, LivingEntity killedEntity, DamageSource damageSource)`

Fired after an entity killed another living entity. Notify-only.

**`ServerEntityHooks.ENTITY_LOAD`**<br>
`void onLoad(Entity entity, ServerLevel level)`

Fired when an entity loads into a level. Notify-only.

**`ServerEntityHooks.ENTITY_UNLOAD`**<br>
`void onUnload(Entity entity, ServerLevel level)`

Fired when an entity unloads from a level. Notify-only.

**`ServerEntityHooks.EQUIPMENT_CHANGE`**<br>
`void onChange(LivingEntity livingEntity, EquipmentSlot equipmentSlot, ItemStack previousStack, ItemStack currentStack)`

Fired when a living entity's equipment in a slot changes. Notify-only.

**`ServerEntityLevelChangeHooks.AFTER_ENTITY_CHANGE_LEVEL`**<br>
`void afterChangeLevel(Entity originalEntity, Entity newEntity, ServerLevel origin, ServerLevel destination)`

Fired after an entity changed level (dimension). Notify-only.

**`ServerEntityLevelChangeHooks.AFTER_PLAYER_CHANGE_LEVEL`**<br>
`void afterChangeLevel(ServerPlayer player, ServerLevel origin, ServerLevel destination)`

Fired after a player changed level (dimension). Notify-only.

**`ServerPlayerHooks.COPY_FROM`**<br>
`void copyFromPlayer(ServerPlayer oldPlayer, ServerPlayer newPlayer, boolean alive)`

Fired when player data is copied to a new player instance on respawn or dimension change, with
whether the old player was still alive. Notify-only.

**`ServerPlayerHooks.AFTER_RESPAWN`**<br>
`void afterRespawn(ServerPlayer oldPlayer, ServerPlayer newPlayer, boolean alive)`

Fired after a player respawned. Notify-only.

**`EntityTrackingHooks.START_TRACKING`**<br>
`void onStartTracking(Entity trackedEntity, ServerPlayer player)`

Fired when a player starts tracking an entity (it enters their view). Notify-only.

**`EntityTrackingHooks.STOP_TRACKING`**<br>
`void onStopTracking(Entity trackedEntity, ServerPlayer player)`

Fired when a player stops tracking an entity. Notify-only.

**`PlayerInteractionHooks.ATTACK_ENTITY`**<br>
`InteractionResult interact(Player player, Level level, InteractionHand hand, Entity entity, @Nullable EntityHitResult hitResult)`

Fired when a player attacks an entity. Return `FAIL` to cancel the attack, `PASS` to continue.

**`PlayerInteractionHooks.ATTACK_BLOCK`**<br>
`InteractionResult interact(Player player, Level level, InteractionHand hand, BlockPos pos, Direction direction)`

Fired when a player attacks (left-clicks) a block. Return `FAIL` to cancel, `PASS` to continue.

**`PlayerInteractionHooks.BREAK_BLOCK`**<br>
`boolean beforeBlockBreak(Level level, Player player, BlockPos pos, BlockState state, @Nullable BlockEntity blockEntity)`

Fired before a player breaks a block. Return `false` to cancel the break.

**`PlayerInteractionHooks.USE_BLOCK`**<br>
`InteractionResult interact(Player player, Level level, InteractionHand hand, BlockHitResult hitResult)`

Fired when a player right-clicks a block. Return `FAIL` to cancel, `PASS` to continue.

**`PlayerInteractionHooks.USE_ENTITY`**<br>
`InteractionResult interact(Player player, Level level, InteractionHand hand, Entity entity, EntityHitResult hitResult)`

Fired when a player right-clicks an entity. Return `FAIL` to cancel, `PASS` to continue.

**`PlayerInteractionHooks.USE_ITEM`**<br>
`InteractionResult interact(Player player, Level level, InteractionHand hand)`

Fired when a player right-clicks with an item. Return `FAIL` to cancel, `PASS` to continue.

### kibu-map-api
**`MapStateCallback.HOOK`**<br>
`MapItemSavedData getMapState(ServerLevel world, MapId id)`

Fired when a filled map's saved state is resolved. Return the `MapItemSavedData` to use for that
map id.

### kibu-translation-api
**`LanguageChangedCallback.HOOK`**<br>
`void onChanged(ServerPlayer player, String language, Reason reason)`

Fired when a player's selected language changes, with the reason for the change. Notify-only.

## pal

**`AllowElevatorCallback.HOOK`**<br>
`boolean canUseElevator(ServerPlayer player, BlockPos pos)`

Fired when a player is about to use an elevator. Return `false` to disallow.

**`AllowTeleporterCallback.HOOK`**<br>
`boolean canUseTeleporter(ServerPlayer player, BlockPos from, BlockPos to)`

Fired when a player is about to use a teleporter. Return `false` to disallow.

**`AllowJumpPadCallback.HOOK`**<br>
`boolean canUseJumPad(ServerPlayer player, BlockPos pos)`

Fired when a player is about to use a jump pad. Return `false` to disallow.

**`AllowBoosterPlateCallback.HOOK`**<br>
`boolean canUseBoosterPlate(ServerPlayer player, BlockPos pos)`

Fired when a player is about to use a booster plate. Return `false` to disallow.

## mg-lobby

**`PlayerSeatCallback.BEFORE_SIT`**<br>
`boolean onSeat(ServerPlayer player, BlockPos pos)`

Fired before a player sits down on a seat. Return `true` to cancel so the player stays standing.

**`PlayerSeatCallback.AFTER_SIT`**<br>
`void onSeated(ServerPlayer player, BlockPos pos)`

Fired after a player sat down. Notify-only.

**`PlayerSeatCallback.AFTER_GET_UP`**<br>
`void onGottenUp(ServerPlayer player)`

Fired after a player got up from a seat. Notify-only.

## combat-control

**`SwordBlockDamageCallback.HOOK`**<br>
`float calculateDamage(ServerPlayer player, DamageSource source, float originalDamage, float currentDamage, ItemStack stack)`

Fired while a blocking player (sword or shield) reduces incoming damage. Return the damage value
to apply (return `currentDamage` to keep the running value).

## game-map-utils

**`GameMapApiReadyCallback.HOOK`**<br>
`void onReady(GameMapApi api, MinecraftServer server)`

Fired when the game map API is ready to use. Notify-only.

**`MapDataLoadedCallback.HOOK`**<br>
`void onMapDataLoaded(ServerLevel world, WorldData worldData)`

Fired after a map's data has been loaded for a world. Notify-only.

**`VirtualEntityAttackCallback.HOOK`**<br>
`void onAttack(ServerPlayer player, int entityId)`

Fired when a player attacks a virtual (client-side only) entity, identified by its network id.
Notify-only.

**`VirtualEntityInteractCallback.HOOK`**<br>
`void onInteract(ServerPlayer player, int entityId, InteractionHand hand, Vec3 pos)`

Fired when a player interacts with a virtual entity, with the hand and hit position. Notify-only.
